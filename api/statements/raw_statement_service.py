from fake.account_statements import ACCOUNT_STATEMENTS
from fake.card_statements import CARD_STATEMENTS


class RawStatementsService:

    def get_card_statements(self):
        return CARD_STATEMENTS

    def get_account_statements(self):
        return ACCOUNT_STATEMENTS
