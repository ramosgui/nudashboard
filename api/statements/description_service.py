from pymongo.database import Database

from config import mongo_connection


class DescriptionService:

    # TODO MONTAR DESCRIPTION VO

    def __init__(self, mongodb: Database):
        self._description_collection = mongodb.nudashboard.descriptions
        self._all_descriptions = self._get_all_descriptions()

    def _get_all_descriptions(self):
        """

        :return:
        """
        descriptions = []
        all_descriptions = self._description_collection.find({})
        for description in all_descriptions:
            descriptions.append(description)
        return descriptions

    def get_description(self, raw_description: str = None, statement_id: str = None):
        """

        :param raw_description:
        :param statement_id:
        :return:
        """
        if not raw_description and not statement_id:
            raise ValueError('raw_description ou statement_id deve ser preenchido')

        statement_description = None
        for description in self._all_descriptions:
            if description.get('statement_ids') and statement_id in description.get('statement_ids'):
                statement_description = description['_id']
            elif description.get('raw_descriptions') and raw_description in description.get('raw_descriptions'):
                statement_description = description['_id']

        return statement_description

    def create_description(self, description: str, statement_id: str = None, raw_description: str = None):
        """

        :param description:
        :param statement_id:
        :param raw_description:
        :return:
        """
        if not statement_id and not raw_description:
            raise ValueError('You must set only one of parameters with default none.')

        filters = {
            '_id': description
        }

        update = {}
        if statement_id:
            update['statement_ids'] = statement_id
        elif raw_description:
            update['raw_descriptions'] = raw_description

        self._description_collection.update_one(filters, {'$addToSet': update}, upsert=True)


if __name__ == '__main__':
    service = DescriptionService(mongodb=mongo_connection())

    service.create_description(description='Salário', statement_id='5dfd2278-903d-4087-86ae-7cf38b1626ec')
