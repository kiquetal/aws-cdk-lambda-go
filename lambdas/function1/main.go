package main

import (
	"context"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// Response represents the structure of our JSON response
type Response struct {
	Message string `json:"message"`
	Status  string `json:"status"`
}

func handler(ctx context.Context, event events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Create a response object
	responseData := Response{
		Message: "Hello from Lambda!",
		Status:  "success",
	}

	// Marshal the response to JSON
	jsonData, err := json.Marshal(responseData)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "{\"message\":\"Error generating response\",\"status\":\"error\"}",
			Headers: map[string]string{
				"Content-Type": "application/json",
			},
		}, nil
	}

	// Return the JSON response
	response := events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(jsonData),
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
	}
	return response, nil
}

func main() {
	lambda.Start(handler)
}
