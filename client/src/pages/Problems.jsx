// pages/Problems.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { problemState } from '../recoil/atoms/problemAtom';
import { 
  getAllProblems,
  getProblemsByDifficulty,
  getProblemsByTag,
  searchProblems,
  createProblem,
  refreshProblem
} from '../services/problemService';
import { createThread } from '../services/threadService';
import ProblemList from '../components/problem/ProblemList';
import ProblemFilter from '../components/problem/ProblemFilter';
import ProblemDisplay from '../components/problem/ProblemDisplay';
import ProblemForm from '../components/problem/ProblemForm';
import Modal from '../components/common/Modal';
import { PlusCircle } from 'lucide-react';
import Button from '../components/common/Button';

const Problems = () => {
  const [problems, setProblems] = useRecoilState(problemState);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingProblem, setIsAddingProblem] = useState(false);
  const [isStartingThread, setIsStartingThread] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  
  // Fetch problems on component mount
  useEffect(() => {
    fetchProblems();
  }, []);
  
  const fetchProblems = async (filters = problems.filters) => {
    setIsLoading(true);
    try {
      let response;
      
      if (filters.search) {
        response = await searchProblems(filters.search);
      } else if (filters.tag) {
        response = await getProblemsByTag(filters.tag);
      } else if (filters.difficulty) {
        response = await getProblemsByDifficulty(filters.difficulty);
      } else {
        response = await getAllProblems(problems.pagination.page, problems.pagination.limit);
      }
      
      if (response.success) {
        setProblems(prev => ({
          ...prev,
          problems: response.data.problems,
          pagination: response.data.pagination || prev.pagination
        }));
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...problems.filters, ...newFilters };
    setProblems(prev => ({
      ...prev,
      filters: updatedFilters
    }));
    fetchProblems(updatedFilters);
  };
  
  const handleSearch = (keyword) => {
    if (keyword.trim().length >= 2) {
      const updatedFilters = { ...problems.filters, search: keyword };
      setProblems(prev => ({
        ...prev,
        filters: updatedFilters
      }));
      fetchProblems(updatedFilters);
    }
  };
  
  const handleAddProblem = async (leetcodeUrl) => {
    setIsAddingProblem(true);
    try {
      const response = await createProblem(leetcodeUrl);
      if (response.success) {
        setIsModalOpen(false);
        
        // Add the new problem to the state
        setProblems(prev => ({
          ...prev,
          problems: [response.data.problem, ...prev.problems]
        }));
        
        // Select the newly added problem
        setSelectedProblem(response.data.problem);
      }
    } catch (error) {
      console.error('Failed to add problem:', error);
    } finally {
      setIsAddingProblem(false);
    }
  };
  
  const handleRefreshProblem = async () => {
    if (!selectedProblem) return;
    
    setIsRefreshing(true);
    try {
      const response = await refreshProblem(selectedProblem._id);
      if (response.success) {
        setSelectedProblem(response.data.problem);
        
        // Update the problem in the state
        setProblems(prev => ({
          ...prev,
          problems: prev.problems.map(p => 
            p._id === response.data.problem._id ? response.data.problem : p
          )
        }));
      }
    } catch (error) {
      console.error('Failed to refresh problem:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleStartThread = async (problem) => {
    setIsStartingThread(true);
    try {
      const response = await createThread(problem._id);
      if (response.success) {
        navigate(`/thread/${response.data.thread._id}`);
      }
    } catch (error) {
      console.error('Failed to start thread:', error);
      setIsStartingThread(false);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Problem List */}
      <div className="w-full md:w-1/2 lg:w-2/3 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">DSA Problems</h1>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            icon={<PlusCircle className="h-5 w-5" />}
          >
            Add Problem
          </Button>
        </div>
        
        <ProblemFilter 
          onFilterChange={handleFilterChange} 
          onSearch={handleSearch}
          initialFilters={problems.filters}
        />
        
        <ProblemList 
          problems={problems.problems} 
          isLoading={isLoading} 
          onSelectProblem={(problem) => {
            setSelectedProblem(problem);
            // On mobile, scroll to the problem details
            if (window.innerWidth < 768) {
              document.getElementById('problem-details').scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </div>
      
      {/* Problem Details */}
      <div 
        id="problem-details"
        className="w-full md:w-1/2 lg:w-1/3 border-l border-gray-800 overflow-y-auto bg-gray-950"
      >
        {selectedProblem ? (
          <div className="sticky top-0">
            <ProblemDisplay 
              problem={selectedProblem} 
              isLoading={isRefreshing}
              onRefresh={handleRefreshProblem}
            />
            
            <div className="px-6 pb-6">
              <Button
                onClick={() => handleStartThread(selectedProblem)}
                fullWidth
                isLoading={isStartingThread}
                size="lg"
              >
                Start Thread with This Problem
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 mb-2">Select a problem to view its details</p>
              <p className="text-sm text-gray-500">Or add a new problem using the "Add Problem" button</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Problem Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add LeetCode Problem"
      >
        <ProblemForm onSubmit={handleAddProblem} isLoading={isAddingProblem} />
      </Modal>
    </div>
  );
};

export default Problems;