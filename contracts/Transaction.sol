pragma solidity ^0.4.11;

contract Transaction {

    address owner = msg.sender;

   bytes32 public sellerName;
   address public sellerAddress;
   bytes32 public sellerEmail;
   bytes32 public sellerGpsLocation;
   bytes public sellerCashLedgerAddress;
   bytes public sellerAssetsLedgerAddress;
   uint public sellerVatNumber;

   address public buyerAddress;
   bytes32 public buyerName;
   bytes32 public buyerEmail;
   bytes32 public buyerGpsLocation;
   bytes public buyerCashLedgerAddress;
   bytes public buyerAssetsLedgerAddress;
   uint public buyerVatNumber;

   bytes public invoiceHashAddress;
   bytes public envelopeId;

   uint public timestamp;
   uint public quantityBought;
   uint public amountPaidWei;
   uint public pricePerItem;
   uint public vat; // Not set on the constructor, set by the seller

   modifier onlyOwner(){
        if(msg.sender == owner)
        _;
    }

    function() payable {}

    function extractEther() onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    function Transaction(
        address[2] buyerSellerAddress, bytes _invoiceHashAddress, uint price,
        bytes32[2] sellerNameEmail, uint[3] buyerVatQuantityPriceItem,
        bytes32[3] buyerNameEmailGpsLocation, bytes buyerCashLedger, bytes buyerAssetsLedger
    ){
        timestamp = block.timestamp;
        amountPaidWei = price;
        buyerAddress = buyerSellerAddress[0];
        sellerAddress = buyerSellerAddress[1];
        invoiceHashAddress = _invoiceHashAddress;
        sellerName = sellerNameEmail[0];
        sellerEmail = sellerNameEmail[1];
        buyerVatNumber = buyerVatQuantityPriceItem[0];
        quantityBought = buyerVatQuantityPriceItem[1];
        pricePerItem = buyerVatQuantityPriceItem[2];
        buyerName = buyerNameEmailGpsLocation[0];
        buyerEmail = buyerNameEmailGpsLocation[1];
        buyerGpsLocation = buyerNameEmailGpsLocation[2];
        buyerCashLedgerAddress = buyerCashLedger;
        buyerAssetsLedgerAddress = buyerAssetsLedger;
    }

    function getInitialData() constant returns(
        bytes32, address, bytes32, address, bytes32, bytes32, bytes32, uint, uint, uint, uint
    ){
        return(
            buyerName, sellerAddress, buyerEmail, buyerAddress, buyerGpsLocation,
            sellerName, sellerEmail, buyerVatNumber, quantityBought, pricePerItem, amountPaidWei
        );
    }

    function getMissingSellerData() constant returns(
        bytes32, bytes, bytes, uint, bytes, bytes, uint, uint, uint, uint
    ){
        return(sellerGpsLocation, sellerCashLedgerAddress, sellerAssetsLedgerAddress,
        sellerVatNumber, invoiceHashAddress, envelopeId, quantityBought, amountPaidWei,
        pricePerItem, vat);
    }

    function completeSellerInvoiceData(
        bytes sellerAssetsLedgerHashAddress, bytes sellerCashLedgerHashAddress,
        bytes32 _sellerGpsLocation, uint _sellerVatNumber, uint transactionVat, bytes finalInvoiceHash,
        bytes _envelopeId
    ){
        sellerAssetsLedgerAddress = sellerAssetsLedgerHashAddress;
        sellerCashLedgerAddress = sellerCashLedgerHashAddress;
        sellerGpsLocation = _sellerGpsLocation;
        sellerVatNumber = _sellerVatNumber;
        vat = transactionVat;
        invoiceHashAddress = finalInvoiceHash;
        envelopeId = _envelopeId;
   }

    function getHashAddresses() constant returns(bytes, bytes, bytes){
        return(
            invoiceHashAddress, buyerCashLedgerAddress, buyerAssetsLedgerAddress
        );
    }

   function releaseFundsWhenBothSigned(){

   }

   function storeLedgersInIpfs(){
      // Generate and update both ledgers with details of the transaction
      // then save them in IPFS using IPFS-API maintaining the hash of them
   }

   function kill(){
       selfdestruct(owner);
   }
}
