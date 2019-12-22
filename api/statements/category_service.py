from pymongo.database import Database

from config import mongo_connection


class CategoryService:

    # TODO MONTAR CATEGORY VO

    def __init__(self, mongodb: Database):
        self._category_collection = mongodb.nudashboard.categories
        self._all_categories = self._get_all_categories()

    def _get_all_categories(self):
        """

        :return:
        """
        categories = []
        all_categories = self._category_collection.find({})
        for category in all_categories:
            categories.append(category)
        return categories

    def get_category(self, raw_category: str = None, statement_id: str = None, raw_description: str = None):
        """

        :param raw_category:
        :param statement_id:
        :param raw_description:
        :return:
        """
        if not raw_category and not statement_id and not raw_description:
            raise ValueError('raw_category, statement_id ou raw_description deve ser preenchido')

        statement_category = None
        for category in self._all_categories:
            if category.get('statement_ids') and statement_id in category.get('statement_ids'):
                statement_category = category['_id']
            elif category.get('raw_categories') and raw_category in category.get('raw_categories'):
                statement_category = category['_id']
            elif category.get('raw_descriptions') and raw_description in category.get('raw_descriptions'):
                statement_category = category['_id']

        return statement_category

    def create_category(self, category: str, statement_id: str = None, raw_category: str = None,
                        raw_description: str = None):
        """

        :param category:
        :param statement_id:
        :param raw_category:
        :param raw_description:
        :return:
        """
        if not statement_id and not raw_category and not raw_description:
            raise ValueError('You must set only one of parameters with default none.')

        filters = {
            '_id': category
        }

        update = {}
        if statement_id:
            update['statement_ids'] = statement_id
        elif raw_category:
            update['raw_categories'] = raw_category
        elif raw_description:
            update['raw_descriptions'] = raw_description

        # TODO SE EXISTIR DESCRIPTION PELO RAW DESCRIPTION, CRIAR PELA DESCRIPTION E NAO PELO RAW DESCRIPTION

        self._category_collection.update_one(filters, {'$addToSet': update}, upsert=True)


if __name__ == '__main__':
    service = CategoryService(mongodb=mongo_connection())

    service.create_category(category='Salário', statement_id='5dfd2278-903d-4087-86ae-7cf38b1626ec')
