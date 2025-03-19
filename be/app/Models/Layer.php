<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Layer extends Model
{
    protected $table = 'layers';

    protected $fillable = [
        'name',
        'description',
        'department_id',
        'is_visible',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
