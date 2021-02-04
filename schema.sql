DROP TABLE searches;

CREATE TABLE searches(
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(255),
  google_results_count NUMERIC,
  niche_score NUMERIC
)