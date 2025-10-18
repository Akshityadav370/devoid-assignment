import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { chatStorageService } from '../services/chat.service';
import { Send, Sparkles, Trash2, X } from 'lucide-react';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const Chatbox = ({ isOpen, onClose, projectId, projectContext }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (projectId) {
      const loadedMessages = chatStorageService.loadMessages(projectId);
      setMessages(loadedMessages);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId && messages.length > 0) {
      chatStorageService.saveMessages(projectId, messages);
    }
  }, [messages, projectId]);

  useEffect(() => {
    if (messagesEndRef.current && !isLoading) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const buildSystemPrompt = () => {
    let prompt = `You are a helpful AI assistant for a project management application. `;

    if (projectContext) {
      prompt += `\n\nCurrent Project Context:`;
      prompt += `\n- Project Name: ${projectContext.name || 'N/A'}`;
      prompt += `\n- Description: ${projectContext.description || 'N/A'}`;

      if (projectContext.tasks) {
        const todoCount = projectContext.tasks.Todo?.length || 0;
        const inProgressCount = projectContext.tasks.InProgress?.length || 0;
        const doneCount = projectContext.tasks.Done?.length || 0;

        prompt += `\n- Tasks Summary: ${todoCount} To Do, ${inProgressCount} In Progress, ${doneCount} Done`;

        if (todoCount + inProgressCount + doneCount > 0) {
          prompt += `\n\nTask Details:`;

          ['Todo', 'InProgress', 'Done'].forEach((status) => {
            const statusTasks = projectContext.tasks[status] || [];
            if (statusTasks.length > 0) {
              prompt += `\n\n${status}:`;
              statusTasks.forEach((task) => {
                prompt += `\n  - ${task.title}`;
                if (task.description) prompt += `: ${task.description}`;
                if (task.dueDate)
                  prompt += ` (Due: ${new Date(
                    task.dueDate
                  ).toLocaleDateString()})`;
                if (task.priority) prompt += ` [Priority: ${task.priority}]`;
              });
            }
          });
        }
      }
    }

    prompt += `\n\nYou can help users with:
- Understanding their tasks and project status
- Providing insights about task priorities and deadlines
- Suggesting task management strategies
- Answering questions about specific tasks
- General project management advice

Be concise, helpful, and professional in your responses.`;

    return prompt;
  };

  const generateAIResponse = async (userMessage) => {
    try {
      const systemPrompt = buildSystemPrompt();

      const conversationHistory = messages
        .slice(-6)
        .map(
          (msg) =>
            `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        )
        .join('\n');

      const fullPrompt = `${systemPrompt}\n\n${
        conversationHistory
          ? `Previous conversation:\n${conversationHistory}\n\n`
          : ''
      }User: ${userMessage}\n\nAssistant:`;

      const google = createGoogleGenerativeAI({
        apiKey: apiKey,
      });

      const { text } = await generateText({
        model: google('gemini-2.0-flash-exp'),
        prompt: fullPrompt,
        maxTokens: 500,
        temperature: 0.7,
      });

      return text;
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw new Error(error.message || 'Failed to generate AI response');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputValue);

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please check your API key and try again.`,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      setMessages([]);
      if (projectId) {
        chatStorageService.clearMessages(projectId);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200'>
      <div className='flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg'>
        <div className='flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-white' />
          <div>
            <h3 className='font-semibold text-white'>AI Assistant</h3>
            <p className='text-xs text-blue-100'>
              {projectContext?.name || 'Project Helper'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={handleClearChat}
            className='p-1.5 hover:bg-blue-700 rounded-md transition-colors'
            title='Clear chat'
          >
            <Trash2 className='w-4 h-4 text-white' />
          </button>
          <button
            onClick={onClose}
            className='p-1.5 hover:bg-blue-700 rounded-md transition-colors'
          >
            <X className='w-5 h-5 text-white' />
          </button>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
        {messages.length === 0 ? (
          <div className='flex items-center justify-center h-full text-gray-400 text-center'>
            <div>
              <Sparkles className='w-12 h-12 mx-auto mb-2 opacity-50' />
              <p className='font-medium'>Welcome! I'm your AI assistant.</p>
              <p className='text-sm mt-2'>
                Ask me anything about your project and tasks!
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : message.isError
                      ? 'bg-red-100 text-red-800 border border-red-300 rounded-bl-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className='text-sm whitespace-pre-wrap break-words'>
                    {message.content}
                  </p>
                  <span className='text-xs opacity-70 mt-1 block'>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className='flex justify-start'>
                <div className='bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-2 shadow-sm'>
                  <div className='flex items-center gap-2'>
                    <div className='flex gap-1'>
                      <span
                        className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0ms' }}
                      ></span>
                      <span
                        className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'
                        style={{ animationDelay: '150ms' }}
                      ></span>
                      <span
                        className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'
                        style={{ animationDelay: '300ms' }}
                      ></span>
                    </div>
                    <span className='text-sm text-gray-500'>
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className='p-4 border-t border-gray-200 bg-white rounded-b-lg'>
        <div className='flex gap-2'>
          <input
            ref={inputRef}
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Ask about your tasks...'
            disabled={isLoading}
            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center'
          >
            <Send className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
