pragma solidity ^0.4.11;

/// @title Transaction is a contract used to maintain invoice data in the blockchain
/// as a method to check who sells what
/// @author Merunas Grincalaitis
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

   // The IPFS hash address of the invoice file
   bytes public invoiceHashAddress;

   // The ID used by docusign to send e-sign notification emails and sign invoices
   bytes public envelopeId;

   uint public timestamp;
   uint public quantityBought;
   uint public amountPaidWei;
   uint public pricePerItem;
   uint public vat; // Not set on the constructor, set by the seller

   /// @notice Modifier to only allow owner's execution
   modifier onlyOwner(){
        if(msg.sender == owner)
        _;
    }

    /// @notice Fallback function to store ether sent directly to this contract
    function() payable {}

    /// @notice Extracts the entire ether of the contract if you are the owner
    function extractEther() onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    /// @notice Constructor to set the initial data of the invoice set by the
    /// buyer, the one who starts the Transaction
    /// @param buyerSellerAddress Array of the buyer and seller addresses
    /// @param _invoiceHashAddress the IPFS hash address of the generated invoice
    /// @param price The price in Wei paid for the transaction. The real ether is
    /// stored in the parent class TransactionsManager
    /// @param sellerNameEmail The name and email of the seller
    /// @param buyerVatQuantityPriceItem Array of uint data containing the buyer's
    /// vat number, the quantity bought by the buyer and the price per item
    /// @param buyerNameEmailGpsLocation Array with the data of the buyer including
    /// his name, his email and his Gps location
    /// @param buyerCashLedger The IPFS hash address of the cash ledger of the buyer
    /// @param buyerAssetsLedger The IPFS hash address of the assets ledger of the buyer
    function Transaction(
        address[2] buyerSellerAddress,
        bytes _invoiceHashAddress,
        uint price,
        bytes32[2] sellerNameEmail,
        uint[3] buyerVatQuantityPriceItem,
        bytes32[3] buyerNameEmailGpsLocation,
        bytes buyerCashLedger,
        bytes buyerAssetsLedger
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

    /// @notice Returns the initial data set in the constructor. Useful for displaying
    /// that information to the seller when he has to confirm the transaction
    function getInitialData() constant returns(
        bytes32, address, bytes32, address, bytes32, bytes32, bytes32, uint, uint, uint, uint
    ){
        return(
            buyerName, sellerAddress, buyerEmail, buyerAddress, buyerGpsLocation,
            sellerName, sellerEmail, buyerVatNumber, quantityBought, pricePerItem, amountPaidWei
        );
    }

    /// @notice Returns the remaining information of the contract set by the seller
    /// after he confirms the transaction and signs it. It also returns data set
    /// by the buyer like the pricePerItem, the vat of the transaction, the amount paid,
    /// and the updated IPFS invoice hash address
    function getMissingSellerData() constant returns(
        bytes32, bytes, bytes, uint, bytes, bytes, uint, uint, uint, uint
    ){
      return(
         sellerGpsLocation, sellerCashLedgerAddress, sellerAssetsLedgerAddress,
         sellerVatNumber, invoiceHashAddress, envelopeId, quantityBought, amountPaidWei,
         pricePerItem, vat
      );
    }

    /// @notice Sets the remaining data of the invoice once the seller confirms the
    /// transaction. This information is set by the seller
    /// @param sellerAssetsLedgerHashAddress The IPFS hash assets ledger address
    /// @param sellerCashLedgerHashAddress The IPFS hash cash ledger address
    /// @param _sellerGpsLocation The GPS location of the seller in coordinates
    /// @param transactionVat The VAT used for this transaction
    /// @param finalInvoiceHash The IPFS invoice hash address with the updated data
    /// @param _envelopeId The ID used by docusign to send esign notifications to
    /// the buyer and the seller
    function completeSellerInvoiceData(
        bytes sellerAssetsLedgerHashAddress,
        bytes sellerCashLedgerHashAddress,
        bytes32 _sellerGpsLocation,
        uint _sellerVatNumber,
        uint transactionVat,
        bytes finalInvoiceHash,
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

   /// @notice Returns the invoice, cash ledger and assets ledger IPFS hash addresses
   function getHashAddresses() constant returns(bytes, bytes, bytes){
        return(
            invoiceHashAddress, buyerCashLedgerAddress, buyerAssetsLedgerAddress
        );
    }

    /// @notice Kills the contract if you're the owner
   function kill() onlyOwner{
       selfdestruct(owner);
   }
}
