"""add product sku barcode brand expiry date

Revision ID: 7e46b329a11b
Revises: 8013271b9c60
Create Date: 2026-08-25
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "7e46b329a11b"
down_revision = "8013271b9c60"
branch_labels = None
depends_on = None


def upgrade():

    with op.batch_alter_table("products", schema=None) as batch_op:

        batch_op.add_column(
            sa.Column(
                "brand",
                sa.String(length=100),
                nullable=True
            )
        )

        batch_op.add_column(
            sa.Column(
                "sku",
                sa.String(length=100),
                nullable=True
            )
        )

        batch_op.add_column(
            sa.Column(
                "barcode",
                sa.String(length=100),
                nullable=True
            )
        )

        batch_op.add_column(
            sa.Column(
                "expiry_date",
                sa.Date(),
                nullable=True
            )
        )

        batch_op.add_column(
            sa.Column(
                "updated_at",
                sa.DateTime(),
                nullable=True
            )
        )


def downgrade():

    with op.batch_alter_table("products", schema=None) as batch_op:

        batch_op.drop_column("updated_at")
        batch_op.drop_column("expiry_date")
        batch_op.drop_column("barcode")
        batch_op.drop_column("sku")
        batch_op.drop_column("brand")