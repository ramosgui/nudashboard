from typing import List

from pymongo.database import Database

from application.categories.model import CategoryModel, colorInfo


class CategoriesRepository:

    def __init__(self, mongodb: Database):
        self._categories_collections = mongodb.get_collection('categories')

    def get_categories(self) -> List[CategoryModel]:
        categories = []

        results = self._categories_collections.find({})
        for result in results:
            model = CategoryModel(id_=result['_id'], icon_name=result['icon'], type_=result['type'],
                                  color_info=colorInfo(color_name=result['color'][0], color_weight=result['color'][1]))
            categories.append(model)

        return categories
