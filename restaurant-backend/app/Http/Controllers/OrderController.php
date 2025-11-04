// app/Http/Controllers/OrderController.php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with(['table', 'user', 'items.menuItem'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required|exists:tables,id',
            'items' => 'required|array',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.special_requests' => 'nullable|string',
        ]);

        $table = Table::find($validated['table_id']);
        if ($table->status === 'occupied') {
            return response()->json(['message' => 'Table is already occupied'], 400);
        }

        $order = Order::create([
            'table_id' => $validated['table_id'],
            'user_id' => Auth::id(),
            'total' => 0,
            'status' => 'pending',
        ]);

        $total = 0;
        foreach ($validated['items'] as $item) {
            $menuItem = MenuItem::find($item['menu_item_id']);
            $orderItem = OrderItem::create([
                'order_id' => $order->id,
                'menu_item_id' => $item['menu_item_id'],
                'quantity' => $item['quantity'],
                'price' => $menuItem->price,
                'special_requests' => $item['special_requests'] ?? null,
                'status' => 'pending',
            ]);
            $total += $menuItem->price * $item['quantity'];
        }

        $order->update(['total' => $total]);
        $table->update(['status' => 'occupied']);

        return Order::with(['table', 'user', 'items.menuItem'])->find($order->id);
    }

    public function show(Order $order)
    {
        return $order->load(['table', 'user', 'items.menuItem']);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:pending,processing,completed,cancelled',
        ]);

        $order->update($validated);

        if ($order->status === 'completed' || $order->status === 'cancelled') {
            $order->table()->update(['status' => 'available']);
        }

        return $order->load(['table', 'user', 'items.menuItem']);
    }

    public function updateItemStatus(Request $request, Order $order, OrderItem $item)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,preparing,ready,served',
        ]);

        $item->update($validated);

        // Check if all items are served to mark order as completed
        $allServed = $order->items()->where('status', '!=', 'served')->count() === 0;
        if ($allServed) {
            $order->update(['status' => 'completed']);
            $order->table()->update(['status' => 'available']);
        }

        return $item->load('menuItem');
    }

    public function destroy(Order $order)
    {
        $order->items()->delete();
        $order->delete();
        return response()->json(null, 204);
    }
}