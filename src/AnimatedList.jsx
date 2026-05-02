import{useRef,useState,useCallback}from'react';
import{motion,useInView}from'motion/react';
import'./AnimatedList.css';
const AnimatedItem=({children,delay=0,index,onMouseEnter,onClick})=>{
  const ref=useRef(null);
  const inView=useInView(ref,{amount:0.5,triggerOnce:false});
  return(
    <motion.div ref={ref} data-index={index} onMouseEnter={onMouseEnter} onClick={onClick}
      initial={{scale:0.88,opacity:0,x:-8}}
      animate={inView?{scale:1,opacity:1,x:0}:{scale:0.88,opacity:0,x:-8}}
      transition={{duration:0.22,delay}}
      style={{marginBottom:7,cursor:'default'}}>
      {children}
    </motion.div>
  );
};
const AnimatedList=({items=[],onItemSelect,showGradients=true,enableArrowNavigation=false,className='',itemClassName='',displayScrollbar=false,initialSelectedIndex=-1})=>{
  const listRef=useRef(null);
  const[selectedIndex,setSelectedIndex]=useState(initialSelectedIndex);
  const[topOp,setTopOp]=useState(0);
  const[botOp,setBotOp]=useState(1);
  const onScroll=useCallback(e=>{const{scrollTop,scrollHeight,clientHeight}=e.target;setTopOp(Math.min(scrollTop/50,1));const bd=scrollHeight-(scrollTop+clientHeight);setBotOp(scrollHeight<=clientHeight?0:Math.min(bd/50,1));},[]);
  return(
    <div className={`scroll-list-container ${className}`}>
      <div ref={listRef} className={`scroll-list ${!displayScrollbar?'no-scrollbar':''}`} onScroll={onScroll}>
        {items.map((item,index)=>(
          <AnimatedItem key={index} delay={index*0.07} index={index}
            onMouseEnter={()=>setSelectedIndex(index)}
            onClick={()=>{setSelectedIndex(index);onItemSelect?.(item,index);}}>
            <div className={`al-item ${selectedIndex===index?'al-selected':''} ${itemClassName}`}>{item}</div>
          </AnimatedItem>
        ))}
      </div>
      {showGradients&&<><div className="al-top-gradient" style={{opacity:topOp}}/><div className="al-bottom-gradient" style={{opacity:botOp}}/></>}
    </div>
  );
};
export default AnimatedList;