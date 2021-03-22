from application.sync.events.abstract_event import AbstractTypename


class DebitPurchase(AbstractTypename):

    @property
    def title(self) -> str:
        detail = self._event['detail'].split('-')[0].strip()
        return f'{self._event["title"]} - {detail}'

    @property
    def amount(self) -> float:
        return self._event['amount'] * -1
