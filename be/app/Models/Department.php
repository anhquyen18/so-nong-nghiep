<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'departments';

    protected $fillable = [
        'name',
        'description',
    ];

    public function layers()
    {
        return $this->hasMany(Layer::class);
    }
}
