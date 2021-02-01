from application.sync.events.barcode_payment import BarcodePayment
from application.sync.events.debit_purchase import DebitPurchase
from application.sync.events.pix_out import PixOut
from application.sync.events.transaction import CardTransaction
from application.sync.events.transaction_reversed import CardTransactionReversed
from application.sync.events.transfer_in import TransferInEvent
from application.sync.events.transfer_out import TransferOutEvent
from application.sync.events.transfer_out_reversal import TransferOutReversal


def account_event_factory(event: dict):
    methods_ = {'TransferInEvent': TransferInEvent, 'TransferOutEvent': TransferOutEvent,
                'DebitPurchaseEvent': DebitPurchase, 'BarcodePaymentEvent': BarcodePayment,
                'TransferOutReversalEvent': TransferOutReversal}

    method_ = methods_.get(event['__typename'])
    if method_:
        return method_(event)
    elif event['__typename'] == 'GenericFeedEvent' and event['title'] == 'Transferência enviada':
        return PixOut(event)


def credit_event_factory(event: dict):
    methods_ = {'transaction': CardTransaction, 'transaction_reversed': CardTransactionReversed}

    method_ = methods_.get(event['category'])
    if method_:
        return method_(event)
