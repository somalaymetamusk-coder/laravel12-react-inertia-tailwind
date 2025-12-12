<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\ProductGallery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(): Response
    {
        $products = Product::with('galleries')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        return Inertia::render('Products/Create');
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(ProductRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Handle feature image upload
        if ($request->hasFile('feature_image')) {
            $data['feature_image'] = $request->file('feature_image')
                ->store('products', 'public');
        }

        // Remove gallery_images from data before creating product
        unset($data['gallery_images'], $data['remove_gallery_ids']);

        $product = Product::create($data);

        // Handle gallery images upload
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $index => $image) {
                $path = $image->store('products/gallery', 'public');
                ProductGallery::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'image_name' => $image->getClientOriginalName(),
                    'sort_order' => $index,
                    'is_primary' => $index === 0,
                ]);
            }
        }

        return redirect()
            ->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): Response
    {
        $product->load('galleries');

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product): Response
    {
        $product->load('galleries');

        return Inertia::render('Products/Edit', [
            'product' => $product,
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();

        // Handle feature image upload
        if ($request->hasFile('feature_image')) {
            // Delete old feature image
            if ($product->feature_image) {
                Storage::disk('public')->delete($product->feature_image);
            }
            $data['feature_image'] = $request->file('feature_image')
                ->store('products', 'public');
        }

        // Handle gallery image removal
        if (!empty($data['remove_gallery_ids'])) {
            $galleriesToRemove = ProductGallery::whereIn('id', $data['remove_gallery_ids'])
                ->where('product_id', $product->id)
                ->get();

            foreach ($galleriesToRemove as $gallery) {
                Storage::disk('public')->delete($gallery->image_path);
                $gallery->delete();
            }
        }

        // Remove gallery_images and remove_gallery_ids from data before updating
        unset($data['gallery_images'], $data['remove_gallery_ids']);

        $product->update($data);

        // Handle new gallery images upload
        if ($request->hasFile('gallery_images')) {
            $maxSortOrder = $product->galleries()->max('sort_order') ?? -1;

            foreach ($request->file('gallery_images') as $index => $image) {
                $path = $image->store('products/gallery', 'public');
                ProductGallery::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'image_name' => $image->getClientOriginalName(),
                    'sort_order' => $maxSortOrder + $index + 1,
                    'is_primary' => false,
                ]);
            }
        }

        return redirect()
            ->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        // Delete feature image
        if ($product->feature_image) {
            Storage::disk('public')->delete($product->feature_image);
        }

        // Delete gallery images
        foreach ($product->galleries as $gallery) {
            Storage::disk('public')->delete($gallery->image_path);
        }

        $product->delete();

        return redirect()
            ->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
