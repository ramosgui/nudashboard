from application.categories.repository import CategoriesRepository


class CategoriesService:

    def __init__(self, categories_repository: CategoriesRepository):
        self._categories_repository = categories_repository

    def get_categories(self):
        return self._categories_repository.get_categories()
