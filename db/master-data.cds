namespace my.motorsport;
// ensure all masterdata entities are available to clients
@cds.autoexpose @readonly
aspect MasterData {}

entity Product : MasterData {
  key ID: UUID;
  productName: String;
  description: String;
  price: Decimal(10, 2); 
  category: String; 
  image: String  @UI : {IsImageURL : true};// This can store a reference to the image location
}
