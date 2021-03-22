from application.sync.events.barcode_payment import BarcodePayment
from application.sync.events.debit_purchase import DebitPurchase
from application.sync.events.pix_out import PixOut
from application.sync.events.transaction import CardTransaction
from application.sync.events.transaction_reversed import CardTransactionReversed
from application.sync.events.transfer_in import TransferInEvent
from application.sync.events.transfer_out import TransferOutEvent
from application.sync.events.transfer_out_reversal import TransferOutReversal
from application.transactions.constants import ALL_VALID_EVENT_TYPES


def get_event_type(event: dict):
    event_type = event.get('__typename') or event.get('category')
    if event_type in ALL_VALID_EVENT_TYPES:
        return event_type
    raise Exception(f'Unknown event type: {event}')


def event_factory(event: dict):

    methods_ = {'TransferInEvent': TransferInEvent, 'TransferOutEvent': TransferOutEvent,
                'DebitPurchaseEvent': DebitPurchase, 'BarcodePaymentEvent': BarcodePayment,
                'TransferOutReversalEvent': TransferOutReversal, 'transaction': CardTransaction,
                'transaction_reversed': CardTransactionReversed}

    event_type = get_event_type(event)
    if event_type:
        method_ = methods_.get(event_type)
        if method_:
            return method_(event)
        elif event_type == 'GenericFeedEvent' and event.get('title') == 'Transferência enviada':
            return PixOut(event)
