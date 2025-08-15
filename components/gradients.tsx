const Gradients = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 min-h-screen bg-noise">
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px]"></div>
      <div className="fixed bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-violet-500/20 rounded-full blur-[100px]"></div>
      <div className="fixed top-[40%] left-[20%] w-[25%] h-[25%] bg-blue-400/10 rounded-full blur-[80px]"></div>
    </div>
  );
};

export default Gradients;
