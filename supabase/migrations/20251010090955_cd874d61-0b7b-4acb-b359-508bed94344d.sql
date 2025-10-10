-- Add movement configuration columns to hero_scenes table
ALTER TABLE public.hero_scenes 
ADD COLUMN IF NOT EXISTS movement_style TEXT DEFAULT 'precision' CHECK (movement_style IN ('precision', 'eternal', 'minimal')),
ADD COLUMN IF NOT EXISTS show_balance_wheel BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_gears BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS hand_style TEXT DEFAULT 'classic' CHECK (hand_style IN ('classic', 'light', 'minimal'));