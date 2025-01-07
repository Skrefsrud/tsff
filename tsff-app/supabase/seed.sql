INSERT INTO roles (role_name) VALUES
  ('player'),
  ('team_leader'),
  ('admin'),
  ('referee');


-- Seed data for 'seasons' table
INSERT INTO seasons (id, year_label, start_date, end_date, created_at)
VALUES
    (gen_random_uuid(), '2023/2024', '2023-08-01', '2024-06-30', CURRENT_TIMESTAMP),
    (gen_random_uuid(), '2024/2025', '2024-08-01', '2025-06-30', CURRENT_TIMESTAMP);
    



INSERT INTO teams (name, logo_url, social_links)
VALUES
    ('New York Yankees', 'https://upload.wikimedia.org/wikipedia/en/2/25/New_York_Yankees_Primary_Logo.svg', '{"facebook": "https://facebook.com/yankees", "twitter": "https://twitter.com/yankees"}'),
    ('Los Angeles Lakers', 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg', '{"facebook": "https://facebook.com/lakers", "twitter": "https://twitter.com/lakers"}'),
    ('Dallas Cowboys', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Dallas_Cowboys.svg', '{"facebook": "https://facebook.com/dallascowboys", "twitter": "https://twitter.com/dallascowboys"}'),
    ('Chicago Bulls', 'https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg', '{"facebook": "https://facebook.com/chicagobulls", "twitter": "https://twitter.com/chicagobulls"}'),
    ('Manchester United', 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg', '{"facebook": "https://facebook.com/manchesterunited", "twitter": "https://twitter.com/manutd"}'),
    ('Real Madrid', 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', '{"facebook": "https://facebook.com/realmadrid", "twitter": "https://twitter.com/realmadrid"}'),
    ('Golden State Warriors', 'https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg', '{"facebook": "https://facebook.com/warriors", "twitter": "https://twitter.com/warriors"}'),
    ('Green Bay Packers', 'https://upload.wikimedia.org/wikipedia/commons/5/50/Green_Bay_Packers_logo.svg', '{"facebook": "https://facebook.com/packers", "twitter": "https://twitter.com/packers"}'),
    ('Boston Red Sox', 'https://upload.wikimedia.org/wikipedia/en/6/6d/Boston_Red_Sox_logo.svg', '{"facebook": "https://facebook.com/redsox", "twitter": "https://twitter.com/redsox"}'),
    ('FC Barcelona', 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg', '{"facebook": "https://facebook.com/fcbarcelona", "twitter": "https://twitter.com/fcbarcelona"}'),
    ('Pittsburgh Steelers', 'https://upload.wikimedia.org/wikipedia/commons/d/de/Pittsburgh_Steelers_logo.svg', '{"facebook": "https://facebook.com/steelers", "twitter": "https://twitter.com/steelers"}'),
    ('Toronto Maple Leafs', 'https://upload.wikimedia.org/wikipedia/en/e/e0/Toronto_Maple_Leafs_logo.svg', '{"facebook": "https://facebook.com/torontomapleleafs", "twitter": "https://twitter.com/mapleleafs"}'),
    ('San Francisco 49ers', 'https://upload.wikimedia.org/wikipedia/commons/3/3e/San_Francisco_49ers_logo.svg', '{"facebook": "https://facebook.com/49ers", "twitter": "https://twitter.com/49ers"}'),
    ('Los Angeles Dodgers', 'https://upload.wikimedia.org/wikipedia/en/6/63/Los_Angeles_Dodgers_logo.svg', '{"facebook": "https://facebook.com/dodgers", "twitter": "https://twitter.com/dodgers"}'),
    ('Miami Heat', 'https://upload.wikimedia.org/wikipedia/en/f/fb/Miami_Heat_logo.svg', '{"facebook": "https://facebook.com/miamiheat", "twitter": "https://twitter.com/miamiheat"}'),
    ('New England Patriots', 'https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg', '{"facebook": "https://facebook.com/patriots", "twitter": "https://twitter.com/patriots"}'),
    ('Chicago Blackhawks', 'https://upload.wikimedia.org/wikipedia/en/2/29/Chicago_Blackhawks_logo.svg', '{"facebook": "https://facebook.com/nhlblackhawks", "twitter": "https://twitter.com/nhlblackhawks"}'),
    ('Liverpool FC', 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg', '{"facebook": "https://facebook.com/liverpoolfc", "twitter": "https://twitter.com/lfc"}'),
    ('New York Knicks', 'https://upload.wikimedia.org/wikipedia/en/2/25/New_York_Knicks_logo.svg', '{"facebook": "https://facebook.com/nyknicks", "twitter": "https://twitter.com/nyknicks"}'),
    ('Detroit Red Wings', 'https://upload.wikimedia.org/wikipedia/en/e/e0/Detroit_Red_Wings_logo.svg', '{"facebook": "https://facebook.com/detroitredwings", "twitter": "https://twitter.com/detroitredwings"}'),
    ('Arsenal FC', 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg', '{"facebook": "https://facebook.com/arsenal", "twitter": "https://twitter.com/arsenal"}'),
    ('Denver Broncos', 'https://upload.wikimedia.org/wikipedia/en/4/44/Denver_Broncos_logo.svg', '{"facebook": "https://facebook.com/denverbroncos", "twitter": "https://twitter.com/broncos"}'),
    ('Boston Celtics', 'https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg', '{"facebook": "https://facebook.com/celtics", "twitter": "https://twitter.com/celtics"}'),
    ('Juventus FC', 'https://upload.wikimedia.org/wikipedia/en/1/15/Juventus_FC_2017_logo.svg', '{"facebook": "https://facebook.com/juventus", "twitter": "https://twitter.com/juventusfcen"}');


