
// Question 1
var answer_1 = db.laureates.distinct("bornCountryCode").length;


// Question 2
var answer_2 = db.laureates.find({$or: [{"bornCity": "Philadelphia, PA"},{"prizes.affiliations.name":"University of Pennsylvania"}]}).count();

// Question 3
var answer_3 = db.laureates.find({$and:[{"gender":"male"},{$or:[{"prizes.category":"chemistry"},{"prizes.category":"literature"}]}]},{"_id":0,"firstname":1,"surname":1});

// Question 4
var answer_4 =db.laureates.aggregate([{$group:{_id:"$prizes.affiliations.name",num:{$sum:1}}},{$sort:{num:-1}}]);

// Question 5
var answer_5 = db.prizes.find({"category":"physics",$where:'this.laureates.length>1'},{_id:0,"category":"$category","year":"$year"}).pretty();

// Question 6
var answer_6 = db.prizes.aggregate([
  { $match: {
      "laureates.firstname":"Avram", "laureates.surname":"Hershko"
  }},
  { $lookup:
      {
         from: "laureates",
         localField: "laureates.id",
         foreignField: "id",
         as: "output"
      }
  },{$unwind:"$output"},
  { $match: {
      "output.bornCity":{$ne: "Brooklyn, NY"},  "output.firstname":{$ne: "Avram"}, "output.surname":{$ne: "Hershko"}
  }},
  
  { $replaceRoot: { newRoot: { $mergeObjects:  [ { born: 0, bornCountry: 0, bornCity: 0 }, "$output" ] }} }
  ,
  { $project : {
      "born" : 1 ,
      "bornCountry" : 1 ,
      "bornCity" : 1 ,
      _id:0
  }}
]).pretty();

// Question 7
var mapFn1 = function () {
    
  emit(this.year,this.laureates.length ); 
};
var reduceFn1 = function (keyType, countVals) {
return Array.sum(countVals);
};
var answer_7 = db.prizes.mapReduce(
mapFn1,
reduceFn1,
{
  out: {inline:1}
}
);


// Question 8

var mapFn2 = function() {
  emit(this.bornCountry,{count:1,sum:this.prizes.length,min:this.prizes.length,max:this.prizes.length})
};


var reduceFn2 = function reduce(keyType, countVals) {
  reducedVal=countVals[0];
  for(var idx=1; idx<countVals.length; idx++){
    var b = countVals[idx]
    reducedVal.count+=b.count;
    reducedVal.sum+=b.sum;
    reducedVal.min=Math.min(b.min,reducedVal.min)
    reducedVal.max=Math.max(b.max,reducedVal.max)

  }

  return reducedVal;
}

var finalizeFn2=function(key, reducedVal){ 
  reduced={average:0,min:reducedVal.min,max:reducedVal.max}
  reduced.average = reducedVal.sum / reducedVal.count;
  return reduced;
}

var answer_8 =db.laureates.mapReduce(mapFn2,reduceFn2,
  {
      out: {inline:1},
      finalize:finalizeFn2
  
  }
  
  );

