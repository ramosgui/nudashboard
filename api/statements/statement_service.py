from datetime import datetime

from pymongo.database import Database
from pymongo.errors import DuplicateKeyError

from config import mongo_connection
from statements.category_service import CategoryService
from statements.description_service import DescriptionService
from statements.raw_statement_service import RawStatementsService

STATEMENT_TYPE_MAPPING = {
    1: 'CreditPurchaseEvent',
    2: 'DebitPurchaseEvent',
    3: 'BarcodePaymentEvent',
    4: 'TransferInEvent',
    5: 'TransferOutEvent',
    6: 'TransferOutReversalEvent'
}

CARD_STATEMENT_TYPES = [1]
ACCOUNT_STATEMENT_TYPES = [2, 3, 4, 5, 6]


class StatementService:

    def __init__(self, mongodb: Database, raw_statements_service: RawStatementsService):
        """

        :param mongodb:
        :param raw_statements_service:
        """
        self._mongodb = mongodb
        self._statements_collection = self._mongodb.nudashboard.statements
        self._raw_statements_service = raw_statements_service

        self._description_service = DescriptionService(mongodb)
        self._category_service = CategoryService(mongodb)

    @staticmethod
    def _get_statement_type_by_name(statement_type_name: str):
        """

        :param statement_type_name:
        :return:
        """
        for id_, name in STATEMENT_TYPE_MAPPING.items():
            if name == statement_type_name:
                return id_

    def get_statement_by_date(self, start_date: datetime, end_date: datetime):
        """

        :param start_date:
        :param end_date:
        :return:
        """

        filters = {'$gte': start_date, '$lte': end_date}
        mongo_statements = self._statements_collection.find({'registered_at': filters}).sort([('registered_at', -1)])

        statements = []
        for statement in mongo_statements:
            mapped_description = self._description_service.get_description(raw_description=statement['raw_description'],
                                                                           statement_id=statement['_id'])
            if mapped_description:
                statement['description'] = mapped_description

            mapped_category = self._category_service.get_category(raw_description=statement['raw_description'],
                                                                  statement_id=statement['_id'],
                                                                  raw_category=statement['raw_category'])
            if mapped_description:
                statement['description'] = mapped_description

            if mapped_category:
                statement['category'] = mapped_category

            statements.append(statement)

        return statements

    def add_statement(self, id_: str, raw_description: str, amount: float, raw_category: str, registered_at: datetime,
                      type_id: int):
        document = {'raw_description': raw_description, 'amount': amount, 'raw_category': raw_category,
                    'registered_at': registered_at, 'type_id': type_id, '_id': id_}

        return self._statements_collection.insert_one(document)

    def sync_statements(self):
        """

        :return:
        """

        for statement in self._raw_statements_service.get_card_statements():
            try:
                amount = statement['amount'] / 100
                registered_at = datetime.strptime(statement['time'], '%Y-%m-%dT%H:%M:%SZ')

                self.add_statement(id_=statement['id'], raw_description=statement['description'],
                                   amount=amount, raw_category=statement['title'],
                                   registered_at=registered_at, type_id=1)
            except DuplicateKeyError:
                pass

        for statement in self._raw_statements_service.get_account_statements():
            statement_type_id = self._get_statement_type_by_name(statement['__typename'])

            if statement_type_id in ACCOUNT_STATEMENT_TYPES:
                registered_at = datetime.strptime(statement['postDate'], '%Y-%m-%d')

                if statement_type_id == 4 and statement['originAccount']:
                    statement['detail'] = statement['originAccount']['name']
                elif statement_type_id == 5:
                    statement['detail'] = statement['destinationAccount']['name']
                elif statement_type_id == 6:
                    statement['amount'] = float(statement['detail'].split(u'\xa0')[-1].replace(',', '.'))

                try:
                    self.add_statement(id_=statement['id'], raw_description=statement['detail'],
                                       amount=statement['amount'], raw_category=statement['title'],
                                       registered_at=registered_at, type_id=statement_type_id)
                except DuplicateKeyError:
                    pass


if __name__ == '__main__':
    mongodb = mongo_connection()
    service = StatementService(mongodb, RawStatementsService())

    a = service.get_statement_by_date(start_date=datetime(2019, 12, 1), end_date=datetime(2019, 12, 31))
    for x in a:
        print('{}'.format(x))


    # service.sync_statements()


    # for card in CARD:
    #
    #     save_result = service.add_statement(raw_description=card['description'], amount=card['amount'],
    #                                         registered_at=card['time'], raw_category=card['title'], type_id=1,
    #                                         id_=card['id'])
    #     print(save_result)

    # a = service.get_statement_by_date(start_date=datetime(2019, 12, 1), end_date=datetime(2019, 12, 31))
    # print([x for x in a])
    #
    # b = service.get_last_card_statement()
    # print(b)

# TODO pensar em parcelas (renderizar sempre?)
# TODO pensar em parcelas adiantadas

