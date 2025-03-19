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
        Schema::create('layer_fields', function (Blueprint $table) {
            $table->id();
            $table->string('field_name');
            $table->string('field_type')->default('text');
            $table->string('field_label');
            $table->boolean('is_required')->default(true);
            $table->foreignId('layer_id')->constrained('layers')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('layer_fields');
    }
};
