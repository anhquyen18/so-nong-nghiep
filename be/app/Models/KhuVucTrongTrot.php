<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KhuVucTrongTrot extends Model
{
    protected $table = 'khu_vuc_trong_trot';
    protected $primaryKey = 'id';
    protected $fillable = ['name', 'description'];
}
