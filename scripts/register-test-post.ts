import {createReadStream} from 'node:fs';
import {getCliClient} from 'sanity/cli';
const client=getCliClient({apiVersion:'2026-11-06'});
const block=(key:string,text:string,style='normal')=>({_key:key,_type:'block',style,markDefs:[],children:[{_key:key+'-text',_type:'span',marks:[],text}]});
async function main(){
 if(client.config().projectId!=='r3e6hitc'||client.config().dataset!=='development')throw Error('Development dataset only');
 const id='blog-ai-design-test-20261109';
 if(await client.getDocument(id)) {console.log('Test post already exists');return;}
 const upload=async(file:string,alt:string)=>{const a=await client.assets.upload('image',createReadStream('public/editorial/'+file),{filename:file});return {_type:'image',asset:{_type:'reference',_ref:a._id},alt};};
 const cover=await upload('blog-imgUnsplashOqtafYt5KTw1.png','화면에 표시된 프로그래밍 코드');
 const photo=await upload('blog-imgFrame1410117987.png','함께 연구하며 의견을 나누는 사람들');
 await client.createIfNotExists({_id:id,_type:'blogPost',title:'[테스트] AI와 함께 만드는 더 나은 개발 과정',slug:{_type:'slug',current:'ai-development-test'},category:{_type:'reference',_ref:'category-ai'},publishedAt:new Date().toISOString(),excerpt:'블로그 상세페이지의 제목, 본문, 이미지와 모바일 레이아웃을 확인하기 위한 AI 카테고리 테스트 글입니다.',thumbnail:cover,cover,body:[
 block('intro','이 글은 블로그 상세페이지와 Sanity 연동을 확인하기 위해 등록한 테스트 콘텐츠입니다. 실제 프로젝트 사례나 성과를 소개하는 글은 아닙니다.'),
 block('heading1','AI를 활용하기 전에 정리할 것','h2'),
 block('paragraph1','개발을 시작하기 전에는 해결하려는 문제와 사용자의 요구를 명확히 정리합니다. 어떤 정보를 입력받고, 어떤 결과를 보여주며, 예외 상황에서는 어떻게 동작해야 하는지 구체적으로 작성하는 과정입니다. 이 테스트 문단에서는 여러 줄의 한글이 데스크톱과 모바일에서 어떻게 읽히는지 확인할 수 있습니다.'),
 {_key:'image1',_type:'contentImage',image:photo,caption:'본문 이미지와 설명의 표시를 확인하기 위한 샘플 이미지입니다.'},
 block('heading2','초안을 만들고 함께 검토하기','h2'),
 block('paragraph2','AI가 만든 초안은 검토의 출발점으로 활용할 수 있습니다. 요구사항과 일치하는지, 중요한 흐름이 빠지지 않았는지, 사용자가 이해하기 쉬운 표현인지 살펴봅니다. 본문 사이에 이미지를 배치해 글의 흐름과 간격을 함께 확인합니다.'),
 block('heading3','직접 편집하고 게시해 보세요','h2'),
 block('paragraph3','Sanity의 블로그 글 메뉴에서 이 문서를 열어 제목, 이미지, 본문을 수정할 수 있습니다. 수정 내용은 초안으로 저장되고 Publish를 누르면 개발 사이트에 반영됩니다. 확인이 끝난 뒤에는 Published 화면에서 Unpublish를 눌러 게시를 취소할 수 있습니다.')
 ]});
 console.log('Published: https://wdp-landing-dev.vercel.app/blog/ai-development-test');
}
main().catch(e=>{console.error(e.message);process.exitCode=1});
