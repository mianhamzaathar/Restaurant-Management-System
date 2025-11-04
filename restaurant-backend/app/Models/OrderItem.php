<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'menu_item_id',
        'quantity',
        'unit_price',
        'special_instructions',
        'status'
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'quantity' => 'integer'
    ];

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePreparing($query)
    {
        return $query->where('status', 'preparing');
    }

    // Methods
    public function subtotal()
    {
        return $this->quantity * $this->unit_price;
    }

    public function markAsReady()
    {
        $this->update(['status' => 'ready']);
    }

    public function markAsServed()
    {
        $this->update(['status' => 'served']);
    }
}