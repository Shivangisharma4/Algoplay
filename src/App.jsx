import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import "./App.css";
import { Analytics } from "@vercel/analytics/react"


const sortingAlgorithms = {
  "Bubble Sort": "Bubble Sort is a simple comparison-based algorithm where each pair of adjacent elements is compared and swapped if they are in the wrong order.",
  "Selection Sort": "Selection Sort repeatedly selects the minimum element from the unsorted portion and places it at the beginning.",
  "Insertion Sort": "Insertion Sort builds the final sorted array one item at a time by comparing each new element to the already-sorted ones and inserting it in the correct position.",
  "Merge Sort": "Merge Sort is a divide-and-conquer algorithm that divides the array into halves, recursively sorts them and then merges the sorted halves.",
  "Quick Sort": "Quick Sort selects a pivot element and partitions the array such that elements less than pivot are on the left, and greater are on the right, and recursively applies the same logic to subarrays."
};

const App = () => {
  const [array, setArray] = useState([]);
  const [narration, setNarration] = useState("");
  const [currentStep, setCurrentStep] = useState({ i: 0, j: 0, pivot: null, l: 0, r: 0, phase: 0 });
  const [completed, setCompleted] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("Bubble Sort");
  const [showMenu, setShowMenu] = useState(false);
  const [pendingSteps, setPendingSteps] = useState([]);
  

  const sortRef = useRef([]);
  const narrationRef = useRef(null);
  const mergeAuxRef = useRef([]);
  const mergeStackRef = useRef([]);
  const quickStackRef = useRef([]); 
  const stepPointer = useRef(0);

  useEffect(() => {
    generateNewArray();
  }, []);

  useEffect(() => {
    if (narrationRef.current) {
      narrationRef.current.scrollTop = narrationRef.current.scrollHeight;
    }
  }, [narration]);

  const generateNewArray = () => {
    const newArr = Array.from({ length: Math.floor(Math.random() * 4) + 4 }, () => Math.floor(Math.random() * 200) + 50);
    setArray(newArr);
    setNarration("Generated new array\n");
    setCurrentStep({ i: 0, j: 0, pivot: null, l: 0, r: 0, phase: 0 });
    setCompleted(false);
    sortRef.current = [...newArr];
    mergeAuxRef.current = [...newArr];
    mergeStackRef.current = [];
    quickStackRef.current = [];
  };

    const nextStep = () => {
      if (completed) {
        return;
      }
  
      const arr = [...sortRef.current];
      const { i, j, phase } = currentStep;
  
      if (selectedAlgorithm === "Bubble Sort") {
        if (i < arr.length - 1) {
          if (j < arr.length - i - 1) {
            setNarration(prev => prev + `Comparing ${arr[j]} and ${arr[j + 1]}\n`);
            if (arr[j] > arr[j + 1]) {
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              setNarration(prev => prev + `Swapped ${arr[j + 1]} and ${arr[j]}\n`);
            } else {
              setNarration(prev => prev + `No swap needed\n`);
            }
            setCurrentStep({ ...currentStep, j: j + 1 });
            setArray([...arr]);
            sortRef.current = arr;
          } else {
            setCurrentStep({ ...currentStep, i: i + 1, j: 0 });
          }
        } else {
          setNarration(prev => prev + "Bubble Sort Completed!\n");
          setCompleted(true);
        }
      } 
      
      else if (selectedAlgorithm === "Selection Sort") {
        if (i < arr.length - 1) {
          let minIdx = i;
          for (let k = i + 1; k < arr.length; k++) {
            if (arr[k] < arr[minIdx]) {
              minIdx = k;
            }
          }
          if (minIdx !== i) {
            setNarration(prev => prev + `Swapping ${arr[i]} with ${arr[minIdx]}\n`);
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          } else {
            setNarration(prev => prev + `${arr[i]} is already in correct position\n`);
          }
          setArray([...arr]);
          sortRef.current = arr;
          setCurrentStep({ ...currentStep, i: i + 1 });
        } else {
          setNarration(prev => prev + "Selection Sort Completed!\n");
          setCompleted(true);
        }
      } 
      
      else if (selectedAlgorithm === "Insertion Sort") {
        if (i < arr.length) {
          if (i === 0) {
            setNarration(prev => prev + `Starting with element ${arr[0]} (already sorted)\n`);
            setCurrentStep({ ...currentStep, i: i + 1 });
          } else {
            let key = arr[i];
            let k = i - 1;
            setNarration(prev => prev + `Inserting ${key} into sorted portion\n`);
            
            while (k >= 0 && arr[k] > key) {
              arr[k + 1] = arr[k];
              k--;
            }
            arr[k + 1] = key;
            
            setNarration(prev => prev + `Placed ${key} at position ${k + 1}\n`);
            setArray([...arr]);
            sortRef.current = arr;
            setCurrentStep({ ...currentStep, i: i + 1 });
          }
        } else {
          setNarration(prev => prev + "Insertion Sort Completed!\n");
          setCompleted(true);
        }
      } 
      
      else if (selectedAlgorithm === "Merge Sort") {
        if (mergeStackRef.current.length === 0 && phase === 0) {
          const mergeStack = [];
          const pushMergeTasks = (l, r) => {
            if (l < r) {
              const m = Math.floor((l + r) / 2);
              pushMergeTasks(l, m);
              pushMergeTasks(m + 1, r);
              mergeStack.push({ l, m, r });
            }
          };
          pushMergeTasks(0, arr.length - 1);
          mergeStackRef.current = mergeStack.reverse();
          setNarration(prev => prev + `Starting Merge Sort - dividing array into smaller parts\n`);
          setCurrentStep({ ...currentStep, phase: 1 });
        } else if (mergeStackRef.current.length > 0) {
          const { l, m, r } = mergeStackRef.current.pop();
          const left = arr.slice(l, m + 1);
          const right = arr.slice(m + 1, r + 1);
          let leftIdx = 0, rightIdx = 0, k = l;
  
          while (leftIdx < left.length && rightIdx < right.length) {
            if (left[leftIdx] <= right[rightIdx]) {
              arr[k++] = left[leftIdx++];
            } else {
              arr[k++] = right[rightIdx++];
            }
          }
          while (leftIdx < left.length) arr[k++] = left[leftIdx++];
          while (rightIdx < right.length) arr[k++] = right[rightIdx++];
  
          setNarration(prev => prev + `Merged [${left.join(',')}] and [${right.join(',')}]\n`);
          setArray([...arr]);
          sortRef.current = arr;
        } else {
          setNarration(prev => prev + `Merge Sort Completed!\n`);
          setCompleted(true);
        }
      } 
      
      else if (selectedAlgorithm === "Quick Sort") {
        if (quickStackRef.current.length === 0 && phase === 0) {
          quickStackRef.current.push({ l: 0, r: arr.length - 1 });
          setNarration(prev => prev + "Starting Quick Sort\n");
          setCurrentStep({ ...currentStep, phase: 1 });
        } else if (quickStackRef.current.length > 0) {
          const { l, r } = quickStackRef.current.pop();
          if (l < r) {
            let pivot = arr[r];
            let i = l - 1;
  
            for (let j = l; j < r; j++) {
              if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
              }
            }
            [arr[i + 1], arr[r]] = [arr[r], arr[i + 1]];
            let pi = i + 1;
  
            quickStackRef.current.push({ l, r: pi - 1 });
            quickStackRef.current.push({ l: pi + 1, r });
  
            setNarration(prev => prev + `Pivot ${pivot} placed at index ${pi}\n`);
            setArray([...arr]);
            sortRef.current = arr;
          }
        } else {
          setNarration(prev => prev + `Quick Sort Completed!\n`);
          setCompleted(true);
        }
      }
    };

  return (
    <motion.div 
      className="bg-gradient-to-br from-stone-900 via-zinc-900 to-neutral-800 min-h-screen w-full flex flex-col items-center px-4 pt-20 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Navbar */}
      <motion.nav 
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gradient-to-r from-zinc-950/60 via-zinc-900/60 to-stone-900/60 text-indigo-300 shadow-md flex justify-between items-center px-6 py-2 border-b border-indigo-900"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center gap-4">
          <button onClick={() => setShowMenu(!showMenu)} className="text-indigo-300 hover:text-indigo-100">
            <Menu />
          </button>
          <motion.div className="text-2xl font-extrabold tracking-wide text-indigo-400">AlgoPlay</motion.div>
        </div>
        <motion.div className="md:flex gap-6 text-sm font-semibold">
          <a href="#" className="hover:text-indigo-200">Sort</a>
          <a href="#" className="hover:text-indigo-200">Visualize</a>
          <a href="#" className="hover:text-indigo-200">Learn</a>
        </motion.div>
      </motion.nav>

      {/* Dropdown Menu */}
      {showMenu && (
        <motion.div 
          className="absolute top-14 left-4 bg-zinc-900 border border-indigo-700 text-indigo-200 p-4 rounded-xl shadow-lg z-40"
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        > 
          <h3 className="text-lg font-semibold mb-2">Choose Sorting Algorithm:</h3>
          <ul className="space-y-1">
            {Object.keys(sortingAlgorithms).map((algo) => (
              <li key={algo}>
                <button
                  className={`text-left w-full px-3 py-1 rounded hover:bg-indigo-700 transition duration-200 ${selectedAlgorithm === algo ? "bg-indigo-800" : ""}`}
                  onClick={() => {
                    setSelectedAlgorithm(algo);
                    setNarration(`Selected ${algo}\n${sortingAlgorithms[algo]}\n`);
                    generateNewArray();
                    setShowMenu(false);
                  }}
                >
                  {algo}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Algorithm Description */}
      <div className="w-full max-w-4xl -mb-16 mt-0">
      <motion.div 
  className="bg-zinc-900 border border-indigo-600 rounded-xl p-4 shadow-lg"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.3 }}
  whileHover={{ 
    scale: 1.02,
    boxShadow: "0px 20px 40px rgba(99, 102, 241, 0.2)"
  }}
>
          <h3 className="text-lg font-bold text-indigo-400 mb-2">
            Current Algorithm: {selectedAlgorithm}
          </h3>
          <p className="text-indigo-300 text-sm leading-relaxed">
            {sortingAlgorithms[selectedAlgorithm]}
          </p>
        </motion.div>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1 h-96 w-full max-w-6xl justify-center mb-10">
  {array.map((val, idx) => (
    <motion.div 
      key={idx} 
      layout 
      animate={{ height: val }} 
      transition={{ 
        duration: 0.6, 
        ease: "easeInOut",
        type: "spring",
        stiffness: 100
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0px 10px 20px rgba(99, 102, 241, 0.3)" 
      }}
      className="flex flex-col items-center"
    >
      <motion.div 
        style={{ height: val }} 
        className="w-10 bg-indigo-600 rounded-t-lg shadow-md flex items-center justify-center text-white text-xs font-bold"
        animate={{ 
          backgroundColor: completed ? "#" : "#333399",
          scale: completed ? [1, 1.1, 1] : 1
        }}
        transition={{ duration: 0.3 }}
      >
        {val}
      </motion.div>
      <motion.div 
        className="text-indigo-300 text-xs mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: idx * 0.1 }}
      >
        Idx {idx}
      </motion.div>
    </motion.div>
  ))}
</div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
       <motion.button 
  whileTap={{ scale: 0.95 }} 
  whileHover={{ 
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.3)"
  }} 
  onClick={generateNewArray} 
  className="px-4 py-2 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 text-indigo-300"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1, duration: 0.5 }}
>
          New Array
        </motion.button>
        <motion.button 
  whileTap={{ scale: 0.95 }} 
  whileHover={{ 
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.3)"
  }} 
  onClick={nextStep} 
  className={`px-4 py-2 rounded-xl text-indigo-300 ${completed ? "bg-zinc-900" : "bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800"}`}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1.1, duration: 0.5 }}
>
  ⏭ Next Step
</motion.button>
      </div>

      {/* Narration Panel */}
      <motion.div 
  ref={narrationRef} 
  className="bg-zinc-900 text-indigo-300 p-5 w-full max-w-4xl rounded-xl h-60 overflow-y-auto font-mono text-sm whitespace-pre-wrap border border-indigo-600 shadow-inner"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 1.2, duration: 0.6 }}
  whileHover={{ borderColor: "#818cf8" }}
>
        {narration}
      </motion.div>
      {/* Analytics component vercel*/}
      <Analytics />
    </motion.div>
  );
};export default App;