import fs from 'node:fs/promises';
const sets={
restaurant:['photo-1517248135467-4c7edcad34c4','photo-1414235077428-338989a2e8c0','photo-1547592180-85f173990554','photo-1509042239860-f550ce710b93','photo-1551218808-94e220e084d2','photo-1514933651103-005eec06c04b'],
sport:['photo-1534438327276-14e5300c3a48','photo-1571019613454-1cb2f99b2d8b','photo-1517836357463-d25dfeac3438','photo-1518611012118-696072aa579a','photo-1544367567-0f2fcb009e0b','photo-1598971639058-fab3c3109a00'],
gaming:['photo-1542751371-adc38448a05e','photo-1593305841991-05c297ba4575','photo-1511512578047-dfb367046420','photo-1598550476439-6847785fcea6','photo-1614294149010-950b698f72c0','photo-1585620385456-4759f9b5c7d9'],
immobilier:['photo-1600210492486-724fe5c67fb0','photo-1613977257363-707ba9348227','photo-1600607687939-ce8a6c25118c','photo-1600566753086-00f18fb6b3ea','photo-1600607687920-4e2a09cf159d','photo-1600047509807-ba8f99d2cdde'],
coiffure:['photo-1600948836101-f9ffda59d250','photo-1560066984-138dadb4c035','photo-1521590832167-7bcbfaa6381f','photo-1562322140-8baeececf3df','photo-1522335789203-aabd1fc54bc9','photo-1527799820374-dcf8d9d4a388'],
voitures:['photo-1503376780353-7e6692767b70','photo-1519641471654-76ce0107ad1b','photo-1555215695-3004980ad54e','photo-1511919884226-fd3cad34687c','photo-1492144534655-ae79c964c9d7','photo-1502877338535-766e1452684a'],
};
await fs.mkdir('public/showroom',{recursive:true});
for(const [sector,photos] of Object.entries(sets)){
 for(const [i,id] of photos.entries()){
  const path=`public/showroom/${sector}-${i+1}.jpg`;
  try{if((await fs.stat(path)).size>1000)continue;}catch{}
  const url=`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=82`;
  const r=await fetch(url);if(!r.ok){console.log('FAILED',sector,i+1,r.status);continue;}
  const bytes=Buffer.from(await r.arrayBuffer());await fs.writeFile(path,bytes);console.log(sector,i+1,bytes.length);
 }
}
// Extra compact-car illustration used by the Citadine catalogue entry.
const compact='public/showroom/voitures-compacte.jpg';
try { await fs.access(compact); } catch {
  const response=await fetch('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1100&q=82');
  if(!response.ok) throw new Error('Photo compacte : '+response.status);
  await fs.writeFile(compact,Buffer.from(await response.arrayBuffer()));
}
