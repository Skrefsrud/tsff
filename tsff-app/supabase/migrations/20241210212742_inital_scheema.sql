-- 2024XXXX_initial_schema.sql

BEGIN;

-- Uncomment if UUID generation is needed and not already enabled
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================
-- Roles and Permissions Tables
-- =========================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles (id) ON DELETE CASCADE,
    UNIQUE(user_id, role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =========================================
-- Core Domain Tables
-- =========================================

CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_label VARCHAR NOT NULL  -- e.g. '2024/2025'
    start_date DATE NOT NULL
    end_date DATE NOT NULL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE season_divisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
    division_name VARCHAR NOT NULL,
    phase VARCHAR(50) CHECK (phase IN ('autumn', 'playoffs')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    logo_url VARCHAR,
    social_links JSON,
    team_leader UUID REFERENCES auth.users (id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE season_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_division_id UUID REFERENCES season_divisions(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (season_division_id, team_id)
);

CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_team_id UUID REFERENCES season_teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players (id) ON DELETE CASCADE,
    matches_played BIGINT DEFAULT 0 NOT NULL,
    goals_scored BIGINT DEFAULT 0 NOT NULL,
    assists BIGINT DEFAULT 0 NOT NULL,
    yellow_cards BIGINT DEFAULT 0 NOT NULL,
    red_cards BIGINT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE referees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_season_team_id UUID REFERENCES season_teams (id) ON DELETE CASCADE,
    away_season_team_id UUID REFERENCES season_teams (id) ON DELETE CASCADE,
    home_score INT DEFAULT 0 NOT NULL,
    away_score INT DEFAULT 0 NOT NULL,
    referee_id UUID REFERENCES referees (id) ON DELETE SET NULL,
    status VARCHAR(50) CHECK (status IN ('scheduled', 'in_progress', 'completed', 'canceled')) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE match_squads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches (id) ON DELETE CASCADE,
    player_id UUID REFERENCES players (id) ON DELETE CASCADE,
    UNIQUE (match_id, player_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE referee_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referee_id UUID REFERENCES referees (id) ON DELETE CASCADE,
    match_id UUID REFERENCES matches (id) ON DELETE CASCADE,
    available BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Event Type Enum
CREATE TYPE event_type AS ENUM ('goal', 'yellow_card', 'red_card');

CREATE TABLE match_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches (id) ON DELETE CASCADE,
    player_id UUID REFERENCES players (id) ON DELETE SET NULL,
    event_type event_type NOT NULL,
    event_time INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE field_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id UUID REFERENCES fields (id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE match_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID UNIQUE REFERENCES matches (id) ON DELETE CASCADE,
    field_id UUID REFERENCES fields (id) ON DELETE SET NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    scheduled_by UUID REFERENCES auth.users (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =========================================
-- Additional Feature Tables
-- =========================================

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    content TEXT NOT NULL,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users (id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES auth.users (id) NOT NULL,
    subject VARCHAR,
    body TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE message_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE(message_id, recipient_id),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE player_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_team_id UUID REFERENCES season_teams (id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES auth.users (id),
    status VARCHAR(50) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending'
);

CREATE TABLE match_reschedule_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches (id) ON DELETE CASCADE,
    requested_by UUID REFERENCES auth.users (id) NOT NULL,
    proposed_start_time TIMESTAMP,
    proposed_end_time TIMESTAMP,
    status VARCHAR(50) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES auth.users (id)
);

CREATE TABLE referee_assignment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referee_id UUID REFERENCES referees (id) ON DELETE CASCADE,
    match_id UUID REFERENCES matches (id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE season_team_standings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_team_id UUID REFERENCES season_teams(id) ON DELETE CASCADE,
    position BIGINT NOT NULL,
    points BIGINT NOT NULL,
    goals_scored BIGINT NOT NULL,
    goals_against BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    ADD CONSTRAINT unique_season_team_standings UNIQUE (season_team_id);

);


COMMIT;
