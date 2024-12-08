-- Enable pgcrypto for UUID generation if needed
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table: divisions
CREATE TABLE divisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: seasons
CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    logo_url VARCHAR,
    social_links JSON,
    team_leader UUID REFERENCES auth.users (id) ON DELETE SET NULL,
    division_id UUID REFERENCES divisions (id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: players
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams (id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    season_id UUID REFERENCES seasons (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: stats
-- Linked to players, ensuring we know the exact season and team from players table.
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

-- Table: judges
-- Uses UUID primary key and references auth.users for identity.
CREATE TABLE judges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: matches
-- References judges(id) to ensure only a valid judge can be assigned.
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID REFERENCES seasons (id) ON DELETE CASCADE,
    home_team_id UUID REFERENCES teams (id) ON DELETE CASCADE,
    away_team_id UUID REFERENCES teams (id) ON DELETE CASCADE,
    result JSON,
    judge_id UUID REFERENCES judges (id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: judge_availability
-- Links a judge to specific matches they can judge.
CREATE TABLE judge_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judge_id UUID REFERENCES judges (id) ON DELETE CASCADE,
    match_id UUID REFERENCES matches (id) ON DELETE CASCADE,
    available BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- First, you can create an enum for event types, or use a separate table:
CREATE TYPE event_type AS ENUM ('goal', 'yellow_card', 'red_card', 'assist');

CREATE TABLE match_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches (id) ON DELETE CASCADE,
    player_id UUID REFERENCES players (id) ON DELETE SET NULL, -- If event always involves a player
    event_type event_type NOT NULL,
    event_time INT, -- e.g. minute of the match, or use TIMESTAMP if you prefer actual time
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
    scheduled_by UUID REFERENCES auth.users (id), -- The admin who scheduled it
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
