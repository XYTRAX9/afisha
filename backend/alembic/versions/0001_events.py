"""create events table"""
from alembic import op
import sqlalchemy as sa

revision = "0001_events"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(180), nullable=False),
        sa.Column("category", sa.String(60), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("venue", sa.String(180), nullable=False),
        sa.Column("address", sa.String(240), nullable=False),
        sa.Column("starts_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("price", sa.Integer(), nullable=False),
        sa.Column("image_url", sa.String(600), nullable=False),
        sa.Column("age_limit", sa.String(8), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_events_title", "events", ["title"])
    op.create_index("ix_events_category", "events", ["category"])
    op.create_index("ix_events_starts_at", "events", ["starts_at"])


def downgrade() -> None:
    op.drop_index("ix_events_starts_at", table_name="events")
    op.drop_index("ix_events_category", table_name="events")
    op.drop_index("ix_events_title", table_name="events")
    op.drop_table("events")
