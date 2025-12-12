<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $productId = $this->route('product')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'sku' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('products', 'sku')->ignore($productId),
            ],
            'feature_image' => ['nullable', 'image', 'max:2048'],
            'is_active' => ['boolean'],
            'gallery_images.*' => ['nullable', 'image', 'max:2048'],
            'remove_gallery_ids' => ['nullable', 'array'],
            'remove_gallery_ids.*' => ['integer', 'exists:product_galleries,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The product name is required.',
            'price.required' => 'The product price is required.',
            'price.numeric' => 'The product price must be a number.',
            'price.min' => 'The product price cannot be negative.',
            'stock.required' => 'The stock quantity is required.',
            'stock.integer' => 'The stock quantity must be a whole number.',
            'stock.min' => 'The stock quantity cannot be negative.',
            'sku.unique' => 'This SKU is already in use.',
            'feature_image.image' => 'The feature image must be an image file.',
            'feature_image.max' => 'The feature image must not be larger than 2MB.',
            'gallery_images.*.image' => 'Each gallery item must be an image file.',
            'gallery_images.*.max' => 'Each gallery image must not be larger than 2MB.',
        ];
    }
}
