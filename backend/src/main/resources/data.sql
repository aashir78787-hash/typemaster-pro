-- TypeMaster Pro Initial Database Seeding
-- 1. Initial Users
INSERT INTO users (id, username, email, password_hash, xp, level, coins, avatar, created_at) VALUES
('usr_admin', 'SpeedTypist', 'typist@typemaster.pro', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8HlV69sN3/J3UfM9d/72Z1K6l1fQte', 250, 2, 300, '⚡', CURRENT_TIMESTAMP);

-- 2. Badges Seed Data
INSERT INTO badges (id, name, description, category, icon, xp) VALUES
('speed-20', 'First Key Strokes', 'Reach 20 WPM on any typing test or lesson.', 'speed', 'Footprints', 50),
('speed-40', 'Swift Fingers', 'Reach 40 WPM on any typing test.', 'speed', 'Zap', 100),
('speed-60', 'Speed Demon', 'Break the 60 WPM barrier.', 'speed', 'Flame', 200),
('speed-80', 'Hyper Velocity', 'Achieve 80 WPM with high accuracy.', 'speed', 'Rocket', 350),
('speed-100', 'Century Club', 'Join the legendary 100+ WPM elite club.', 'speed', 'Crown', 600),
('speed-120', 'Grandmaster Typist', 'Reach a blistering 120 WPM.', 'speed', 'Sparkles', 1000),
('acc-98', 'Precision Striker', 'Complete a test with at least 98% accuracy.', 'accuracy', 'Target', 100),
('acc-100', 'Flawless Execution', 'Score a perfect 100% accuracy on a 60-second test.', 'accuracy', 'CheckCheck', 300),
('streak-1', 'Day One Spark', 'Complete your first practice day.', 'streak', 'Calendar', 50),
('streak-7', 'Week Warrior', 'Maintain a 7-day practice streak.', 'streak', 'Award', 350),
('lesson-1', 'The Journey Begins', 'Complete your very first lesson with passing grade.', 'lessons', 'BookOpen', 50),
('game-race-win', 'Podium Champion', 'Win 1st place in a typing race.', 'games', 'Trophy', 200);

-- 3. Sample Lessons Seed Data
INSERT INTO lessons (id, level_num, level_name, title, description, hand_guide_tip, target_wpm, target_accuracy, exercise_text) VALUES
(1, 1, 'Home Row Fundamentals', 'The Anchor Keys: F and J', 'Feel the tactile bumps on F and J.', 'Rest left index on F, right index on J. Hit Space with your thumb.', 15, 95, 'f j f j ff jj fj jf fff jjj fjf jfj f j f j ff jj f f j j fj fj'),
(2, 1, 'Home Row Fundamentals', 'Middle Fingers: D and K', 'Add your middle fingers resting on D and K.', 'Keep your fingers curved naturally. Keep wrists raised.', 18, 95, 'd k d k dd kk dk kd f d j k fd jk df kj ddd kkk dfjk kfdj d k'),
(3, 1, 'Home Row Fundamentals', 'Ring Fingers: S and L', 'Bring the ring fingers into play with S and L.', 'Do not look at the keyboard. Train your tactile muscle memory.', 20, 95, 's l s l ss ll sl ls as df jk l; s d f j k l sldk sl dk lskd'),
(4, 1, 'Home Row Fundamentals', 'Pinky Fingers: A and Semicolon', 'Complete the base home row with A and semicolon.', 'Pinkies require light, crisp taps.', 20, 95, 'a ; a ; aa ;; a; ;a as df j k l; asdf jkl; a s d f j k l ;');
