<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'table_id',
        'user_id',
        'status',
        'total_amount',
        'notes',
        'customer_name',
        'customer_phone'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2'
    ];

    // Relationships
    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    // Methods
    public function calculateTotal()
    {
        return $this->orderItems->sum(function ($item) {
            return $item->quantity * $item->unit_price;
        });
    }

    public function markAsPaid()
    {
        $this->update([
            'status' => 'paid',
            'total_amount' => $this->calculateTotal()
        ]);
        $this->table->markAsAvailable();
    }

    public function addItem(MenuItem $menuItem, $quantity = 1, $specialInstructions = null)
    {
        return $this->orderItems()->create([
            'menu_item_id' => $menuItem->id,
            'quantity' => $quantity,
            'unit_price' => $menuItem->price,
            'special_instructions' => $specialInstructions
        ]);
    }
}