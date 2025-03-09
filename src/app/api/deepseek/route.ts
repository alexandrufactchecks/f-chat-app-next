import { NextRequest, NextResponse } from 'next/server';

// DeepSeek API endpoint
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Get the API key from environment variables
const API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'DeepSeek API key is missing in server environment' },
        { status: 500 }
      );
    }

    // Get request body
    const requestData = await request.json();
    
    // Validate request data
    if (!requestData.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Prepare data for DeepSeek API
    const deepseekRequestData = {
      model: 'deepseek-chat', // Use the appropriate model
      messages: [
        {
          role: 'user',
          content: requestData.message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    };
    
    // Log request (for debugging)
    console.log('Sending request to DeepSeek API:', {
      url: DEEPSEEK_API_URL,
      data: deepseekRequestData,
    });

    // Call DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(deepseekRequestData),
    });

    // Parse response data
    const responseData = await response.json();
    
    // Check for API errors
    if (!response.ok) {
      console.error('DeepSeek API error:', responseData);
      return NextResponse.json(
        { 
          error: `DeepSeek API error: ${responseData.error?.message || 'Unknown error'}`,
          status: response.status,
        },
        { status: response.status }
      );
    }

    // Extract the assistant's message from the response
    const assistantMessage = responseData.choices[0].message.content;
    
    // Return successful response
    return NextResponse.json({
      text: assistantMessage,
      // Additional metadata can be added here if needed
    });
    
  } catch (error: any) {
    // Log error for debugging
    console.error('Error calling DeepSeek API:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred while processing your request',
      },
      { status: 500 }
    );
  }
} 