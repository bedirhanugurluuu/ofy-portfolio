-- About content tablosundaki verileri kontrol et
SELECT 
  id,
  title,
  subtitle,
  main_text,
  vision_title,
  vision_text,
  approach_title,
  approach_subtitle,
  brand_strategy_title,
  brand_strategy_text,
  visual_design_title,
  visual_design_text,
  launch_title,
  launch_text,
  insights_title,
  insights_subtitle,
  clients_title,
  clients_list,
  industries_title,
  industries_list
FROM about_content;

-- Eğer main_text boşsa, varsayılan değer ekle
UPDATE about_content 
SET main_text = 'A collective of visionaries shaping tomorrow, where creativity and innovation intersect. Our studio is built on the belief that bold ideas and meticulous execution drive meaningful design.'
WHERE main_text IS NULL OR main_text = '';
