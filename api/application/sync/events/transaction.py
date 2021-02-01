from datetime import datetime

from application.sync.events.abstract_event import AbstractTypename


class CardTransaction(AbstractTypename):

    @property
    def title(self) -> str:
        return self._event['description']

    @property
    def amount(self) -> float:
        return (self._event['amount'] / 100) * -1

    @property
    def category(self) -> str:
        return self._event['category']

    @property
    def post_date(self) -> datetime:
        return datetime.strptime(self._event['time'], '%Y-%m-%dT%H:%M:%SZ')

    @property
    def charges(self) -> int:
        return self._event.get('charges')

    @property
    def index(self):
        return self._event.get('index')

    @property
    def type(self) -> str:
        return self._event['details']['subcategory']

    def as_dict(self):
        dict_ = {'_id': self.id, 'title': self.title, 'category': self.category, 'amount': self.amount,
                 'post_date': self.post_date, 'type': self.type}

        if self.charges:
            dict_['charges'] = self.charges

        if self.index:
            dict_['index'] = self.index

        return dict_
