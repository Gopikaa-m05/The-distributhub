import React, { useState, useCallback } from 'react';
import { searchContract, compareContracts } from '../services/geminiService';
import { CpuChipIcon, DocumentArrowUpIcon, QuestionMarkCircleIcon, SparklesIcon, DocumentDuplicateIcon } from './icons/Icons';

const FileUploadCard: React.FC<{
    title: string;
    fileName: string;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string;
}> = ({ title, fileName, onFileChange, error }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex-1">
        <h3 className="text-md font-semibold mb-3 flex items-center text-slate-700">
            <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
            {title}
        </h3>
        <input
            type="file"
            accept=".txt,.pdf"
            onChange={onFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {fileName && <p className="text-sm text-slate-500 mt-2 truncate">Loaded: <strong>{fileName}</strong></p>}
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
);


const AIDocumentAnalysisDashboard: React.FC = () => {
    const [documentText1, setDocumentText1] = useState<string>('');
    const [fileName1, setFileName1] = useState<string>('');
    const [error1, setError1] = useState<string>('');

    const [documentText2, setDocumentText2] = useState<string>('');
    const [fileName2, setFileName2] = useState<string>('');
    const [error2, setError2] = useState<string>('');

    const [mode, setMode] = useState<'qa' | 'compare'>('qa');
    const [selectedDocForQA, setSelectedDocForQA] = useState<'A' | 'B'>('A');

    const [query, setQuery] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<string>('');
    const [resultTitle, setResultTitle] = useState('Analysis Result');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, doc: 'A' | 'B') => {
        const file = event.target.files?.[0];
        if (!file) return;

        const setDocumentText = doc === 'A' ? setDocumentText1 : setDocumentText2;
        const setFileName = doc === 'A' ? setFileName1 : setFileName2;
        const setError = doc === 'A' ? setError1 : setError2;

        setQuery('');
        setAnalysisResult('');
        
        if (file.type === 'text/plain' || file.type === 'application/pdf') {
            const text = file.type === 'text/plain' 
                ? await file.text()
                // Mocking PDF content reading
                : `Content of PDF file '${file.name}' successfully loaded for analysis.`;
            setDocumentText(text);
            setFileName(file.name);
            setError('');
        } else {
            setDocumentText('');
            setFileName('');
            setError('Invalid file. Use .txt or .pdf.');
        }
    };
    
    const handleGenerateAnalysis = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const docToQuery = selectedDocForQA === 'A' ? documentText1 : documentText2;
        if (!query.trim() || !docToQuery || isLoading) return;

        setIsLoading(true);
        setAnalysisResult('');
        setResultTitle(`Q&A Result for Contract ${selectedDocForQA}`);

        try {
            const result = await searchContract(docToQuery, query);
            setAnalysisResult(result);
        } catch (err) {
            setAnalysisResult('Failed to generate analysis. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [query, documentText1, documentText2, isLoading, selectedDocForQA]);

    const handleCompareContracts = useCallback(async () => {
        if (!documentText1 || !documentText2 || isLoading) return;
        
        setIsLoading(true);
        setAnalysisResult('');
        setResultTitle('Contract Comparison');

        try {
            const result = await compareContracts(documentText1, documentText2);
            setAnalysisResult(result);
        } catch (err) {
            setAnalysisResult('Failed to compare contracts. Please try again.');
        } finally {
            setIsLoading(false);
        }

    }, [documentText1, documentText2, isLoading]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-1">AI Document Analysis</h2>
            <p className="text-slate-600 mb-6">Upload contracts to ask questions or compare documents side-by-side.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column: Inputs */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 text-slate-700">1. Upload Contracts</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <FileUploadCard title="Contract A" fileName={fileName1} onFileChange={(e) => handleFileChange(e, 'A')} error={error1} />
                            <FileUploadCard title="Contract B" fileName={fileName2} onFileChange={(e) => handleFileChange(e, 'B')} error={error2} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 text-slate-700">2. Choose Action</h3>
                        <div className="flex border-b border-slate-200 mb-4">
                            <button onClick={() => setMode('qa')} className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'qa' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                                Single Document Q&A
                            </button>
                            <button onClick={() => setMode('compare')} className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'compare' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                                Contract Comparison
                            </button>
                        </div>

                        {mode === 'qa' && (
                            <form onSubmit={handleGenerateAnalysis} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Query Document:</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input type="radio" name="selectedDoc" value="A" checked={selectedDocForQA === 'A'} onChange={() => setSelectedDocForQA('A')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" disabled={!documentText1}/>
                                            <span className={`ml-2 text-sm ${!documentText1 ? 'text-slate-400' : 'text-slate-700'}`}>Contract A</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" name="selectedDoc" value="B" checked={selectedDocForQA === 'B'} onChange={() => setSelectedDocForQA('B')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" disabled={!documentText2}/>
                                            <span className={`ml-2 text-sm ${!documentText2 ? 'text-slate-400' : 'text-slate-700'}`}>Contract B</span>
                                        </label>
                                    </div>
                                </div>
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="e.g., What are the payment terms?"
                                    className="w-full p-3 bg-white text-slate-700 placeholder-slate-400 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
                                    rows={3}
                                    disabled={isLoading || (selectedDocForQA === 'A' && !documentText1) || (selectedDocForQA === 'B' && !documentText2)}
                                    aria-label="Ask a question about the document"
                                />
                                <button type="submit" disabled={isLoading || !query.trim() || (selectedDocForQA === 'A' && !documentText1) || (selectedDocForQA === 'B' && !documentText2)} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors flex items-center justify-center">
                                    <SparklesIcon className="w-5 h-5 mr-2" />
                                    {isLoading ? 'Analyzing...' : 'Generate Analysis'}
                                </button>
                            </form>
                        )}

                        {mode === 'compare' && (
                            <div>
                                <p className="text-sm text-slate-600 mb-4">Click the button below to analyze the differences between Contract A and Contract B.</p>
                                 <button onClick={handleCompareContracts} disabled={isLoading || !documentText1 || !documentText2} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors flex items-center justify-center">
                                    <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                                    {isLoading ? 'Comparing...' : 'Compare Contracts'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Output */}
                <div className="bg-white p-6 rounded-lg shadow-md min-h-[300px]">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-slate-700">
                        <CpuChipIcon className="w-6 h-6 mr-2" />
                        {resultTitle}
                    </h3>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                             <div className="flex items-center space-x-1 text-slate-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </div>
                    ) : analysisResult ? (
                        <div className="text-slate-700 whitespace-pre-wrap prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>
                    ) : (
                        <div className="text-center text-slate-500 py-10">
                            <p>Your analysis will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIDocumentAnalysisDashboard;
