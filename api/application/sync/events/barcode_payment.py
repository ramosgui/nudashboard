from application.sync.events.abstract_event import AbstractTypename


class BarcodePayment(AbstractTypename):

    @property
    def title(self) -> str:
        return f'{self._event["title"]} - {self._event["detail"]}'

    @property
    def amount(self) -> float:
        return self._event['amount'] * -1
