/*
  # Create Products Table for Managing Product Pages

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL identifier (preset or lut)
      - `title` (text) - Main heading
      - `subtitle` (text) - Hero subtitle/description
      - `hero_icon` (text) - Icon name for hero section
      - `store_url` (text) - Link to store
      - `secondary_url` (text) - Secondary CTA link (test/demo)
      - `secondary_url_label` (text) - Label for secondary button
      - `features` (jsonb) - Array of feature strings
      - `packages` (jsonb) - Array of package objects
      - `extra_section_title` (text) - Optional extra section title
      - `extra_section_description` (text) - Optional extra section description
      - `extra_section_items` (jsonb) - Optional array of extra items
      - `cta_title` (text) - Final CTA section title
      - `cta_description` (text) - Final CTA section description
      - `meta_description` (text) - SEO meta description
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access
    - Add policy for authenticated admin write access

  3. Seed Data
    - Insert default data for preset and lut pages
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text NOT NULL,
  hero_icon text DEFAULT 'FaCamera',
  store_url text NOT NULL,
  secondary_url text,
  secondary_url_label text,
  features jsonb DEFAULT '[]'::jsonb,
  packages jsonb DEFAULT '[]'::jsonb,
  extra_section_title text,
  extra_section_description text,
  extra_section_items jsonb DEFAULT '[]'::jsonb,
  cta_title text NOT NULL,
  cta_description text NOT NULL,
  meta_description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO products (
  slug,
  title,
  subtitle,
  hero_icon,
  store_url,
  secondary_url,
  secondary_url_label,
  features,
  packages,
  extra_section_title,
  extra_section_description,
  extra_section_items,
  cta_title,
  cta_description,
  meta_description
) VALUES (
  'preset',
  'Professional Lightroom Presets',
  'Transform your photography with professionally crafted Lightroom presets. Achieve cinematic color grading and stunning visual aesthetics with just one click.',
  'FaCamera',
  'https://store.masarif.id/preset',
  'https://tes.masarif.id',
  'Test Presets Now',
  '["Professional color grading", "Film-inspired tones", "Easy one-click application", "Compatible with Lightroom CC & Classic", "Mobile & Desktop versions included", "Lifetime updates"]'::jsonb,
  '[
    {"name": "Cinematic Pack", "description": "Film-inspired presets for dramatic storytelling", "price": "$29", "count": 12, "countLabel": "presets"},
    {"name": "Portrait Pack", "description": "Perfect skin tones and natural beauty enhancement", "price": "$24", "count": 10, "countLabel": "presets"},
    {"name": "Landscape Pack", "description": "Enhanced nature photography with vibrant colors", "price": "$27", "count": 15, "countLabel": "presets"}
  ]'::jsonb,
  'Try Before You Buy',
  'Not sure which preset is right for you? Test our presets first and see the magic yourself. Try them on your own photos before making a purchase.',
  '[]'::jsonb,
  'Ready to Transform Your Photos?',
  'Join thousands of photographers who have elevated their work with our professional presets. Start creating stunning images today.',
  'Professional Lightroom presets by Arif for stunning photography edits. Transform your photos with cinematic color grading.'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
  slug,
  title,
  subtitle,
  hero_icon,
  store_url,
  secondary_url,
  secondary_url_label,
  features,
  packages,
  extra_section_title,
  extra_section_description,
  extra_section_items,
  cta_title,
  cta_description,
  meta_description
) VALUES (
  'lut',
  'Professional Video LUTs',
  'Achieve cinematic color grading with our professional video LUTs. Transform your footage with Hollywood-style color correction and creative looks.',
  'FaVideo',
  'https://store.masarif.id/lut',
  null,
  'Watch Demo',
  '["Cinematic color grading", "Hollywood-style looks", "Compatible with all major editors", "Premiere Pro, Final Cut, DaVinci Resolve", "Log and Rec.709 versions", "Instant download"]'::jsonb,
  '[
    {"name": "Cinematic Pack", "description": "Hollywood-inspired LUTs for dramatic storytelling", "price": "$39", "count": 20, "countLabel": "LUTs"},
    {"name": "Vintage Pack", "description": "Retro and film-inspired color grading", "price": "$34", "count": 15, "countLabel": "LUTs"},
    {"name": "Modern Pack", "description": "Contemporary and clean color correction", "price": "$37", "count": 18, "countLabel": "LUTs"}
  ]'::jsonb,
  'Compatible Software',
  'Our LUTs work seamlessly with all major video editing software',
  '["Adobe Premiere Pro", "Final Cut Pro X", "DaVinci Resolve", "Adobe After Effects", "Avid Media Composer", "Filmora"]'::jsonb,
  'Ready to Create Cinematic Videos?',
  'Join professional filmmakers and content creators who trust our LUTs for their projects. Start creating stunning videos today.',
  'Professional video LUTs by Arif for cinematic color grading. Transform your videos with Hollywood-style color correction.'
) ON CONFLICT (slug) DO NOTHING;
