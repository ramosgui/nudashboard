from abc import ABC, abstractmethod
from datetime import datetime


class AbstractTypename(ABC):

    def __init__(self, transaction: dict):
        self._event = transaction

    @property
    def id(self):
        return self._event['id']

    @property
    def title(self) -> str:
        return self._event['title']

    @property
    def category(self) -> str:
        return self._event['__typename']

    @property
    def post_date(self) -> datetime:
        return datetime.strptime(self._event['postDate'], '%Y-%m-%d')

    @property
    @abstractmethod
    def amount(self) -> float:
        pass

    def as_dict(self):
        return {'_id': self.id, 'title': self.title, 'category': self.category, 'amount': self.amount,
                'post_date': self.post_date, 'type': 'account'}
