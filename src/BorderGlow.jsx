import{useRef,useCallback}from'react';
import'./BorderGlow.css';
function parseHSL(s){const m=s.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);if(!m)return{h:225,s:80,l:60};return{h:parseFloat(m[1]),s:parseFloat(m[2]),l:parseFloat(m[3])};}
function buildGlowVars(glowColor,intensity){const{h,s,l}=parseHSL(glowColor);const base=`${h}deg ${s}% ${l}%`;const ops=[100,60,50,40,30,20,10];const keys=['','-60','-50','-40','-30','-20','-10'];const vars={};for(let i=0;i<ops.length;i++)vars[`--glow-color${keys[i]}`]=`hsl(${base} / ${Math.min(ops[i]*intensity,100)}%)`;return vars;}
const GP=['80% 55%','69% 34%','8% 6%','41% 38%','86% 85%','82% 18%','51% 4%'];
const GK=['--gradient-one','--gradient-two','--gradient-three','--gradient-four','--gradient-five','--gradient-six','--gradient-seven'];
const CM=[0,1,2,0,1,2,1];
function buildGradientVars(colors){const vars={};for(let i=0;i<7;i++){const c=colors[Math.min(CM[i],colors.length-1)];vars[GK[i]]=`radial-gradient(at ${GP[i]}, ${c} 0px, transparent 50%)`;}vars['--gradient-base']=`linear-gradient(${colors[0]} 0 100%)`;return vars;}
const BorderGlow=({children,className='',edgeSensitivity=30,glowColor='225 80 60',backgroundColor='rgba(5,5,18,0.96)',borderRadius=16,glowRadius=40,glowIntensity=1.0,coneSpread=25,colors=['#4361ee','#3a86ff','#7b9cff'],fillOpacity=0.4})=>{
  const cardRef=useRef(null);
  const getCenter=useCallback(el=>{const{width,height}=el.getBoundingClientRect();return[width/2,height/2]},[]);
  const getEdge=useCallback((el,x,y)=>{const[cx,cy]=getCenter(el);const dx=x-cx,dy=y-cy;let kx=Infinity,ky=Infinity;if(dx!==0)kx=cx/Math.abs(dx);if(dy!==0)ky=cy/Math.abs(dy);return Math.min(Math.max(1/Math.min(kx,ky),0),1);},[getCenter]);
  const getAngle=useCallback((el,x,y)=>{const[cx,cy]=getCenter(el);const dx=x-cx,dy=y-cy;if(dx===0&&dy===0)return 0;let d=Math.atan2(dy,dx)*(180/Math.PI)+90;if(d<0)d+=360;return d;},[getCenter]);
  const onMove=useCallback(e=>{const card=cardRef.current;if(!card)return;const rect=card.getBoundingClientRect();const x=e.clientX-rect.left,y=e.clientY-rect.top;card.style.setProperty('--edge-proximity',`${(getEdge(card,x,y)*100).toFixed(3)}`);card.style.setProperty('--cursor-angle',`${getAngle(card,x,y).toFixed(3)}deg`);},[getEdge,getAngle]);
  const glowVars=buildGlowVars(glowColor,glowIntensity);
  return(
    <div ref={cardRef} onPointerMove={onMove} className={`border-glow-card ${className}`}
      style={{'--card-bg':backgroundColor,'--edge-sensitivity':edgeSensitivity,'--border-radius':`${borderRadius}px`,'--glow-padding':`${glowRadius}px`,'--cone-spread':coneSpread,'--fill-opacity':fillOpacity,...glowVars,...buildGradientVars(colors)}}>
      <span className="edge-light"/>
      <div className="border-glow-inner">{children}</div>
    </div>
  );
};
export default BorderGlow;