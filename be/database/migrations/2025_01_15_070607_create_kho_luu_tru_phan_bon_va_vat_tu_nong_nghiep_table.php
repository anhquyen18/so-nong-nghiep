<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kho_luu_tru_phan_bon_va_vat_tu_nong_nghiep', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->jsonb('datafields')->nullable();
            $table->geometry('geom');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kho_luu_tru_phan_bon_va_vat_tu_nong_nghiep');
    }
};
