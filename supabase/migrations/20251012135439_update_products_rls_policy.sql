/*
  # Update Products RLS Policy for Admin Access

  1. Changes
    - Allow public (anon) role to update products for admin panel
    - Keep existing read access for everyone
    - Note: In production, this should be protected with proper authentication

  2. Security
    - This is for development/admin purposes
    - In production, implement proper authentication before deploying
*/

-- Drop existing update policy
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;

-- Create new policy that allows anon key to update (for admin panel)
CREATE POLICY "Anyone can update products"
  ON products
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Also allow anon to delete if needed
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

CREATE POLICY "Anyone can delete products"
  ON products
  FOR DELETE
  TO public
  USING (true);