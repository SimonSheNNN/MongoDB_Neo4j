
// Question 9
CREATE (n15:City{name:"Paris", country:"United States of America"}) 




// Question 10
MATCH (c:City{name:"Paris"})-[:HAS_FLIGHT]->(f:Flight)-[:FLYING_TO]->(d:City) 
RETURN c as source,f as flight,d as destination



// Question 11
MATCH (c:City)-[:HAS_FLIGHT]->(:Flight)-[:FLYING_TO]->(d:City) 
RETURN  distinct {name: c.name, country: c.country} as source , collect(distinct d) as dest
order by source.name asc


// Question 12
MATCH (c:City)-[:HAS_FLIGHT]->(:Flight)-[:FLYING_TO]->(d:City) 
where  not c.country = d.country
with collect(DISTINCT c.name) as foreign
match (list:City)
where not list.name in foreign
return list.name as name


// Question 13
MATCH (c:City{name:"Paris"})-[:HAS_FLIGHT]->(f1:Flight)-[:FLYING_TO]->(v:City) -[:HAS_FLIGHT]->(f2:Flight)-[:FLYING_TO]->(d:City)
where v.name <>"Paris" and d.name<>"Paris" and f1.carrier=f2.carrier
ReTurn d.name as destination, v.name as via, f1.carrier as carrier, [f1.code, f2.code] as flight_nums


// Question 14
match p=shortestPath((c:City{name:"Paris"})-[:HAS_FLIGHT|FLYING_TO*]
->(d:City{name:"Las Vegas"}))
return length(p)-2 as length

