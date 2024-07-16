import { useState } from "react";
import { Card, Form, Radio, Button, Progress, message, Typography } from "antd";
import axios from "axios";
import questions from "./questions";

const { Title } = Typography;

const Questionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);
  const [animation, setAnimation] = useState("fade-in");
  const [answers, setAnswers] = useState({});

  const handleNext = () => {
    form
      .validateFields()
      .then((values) => {
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          ...values,
        }));
        setAnimation("fade-out");
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setAnimation("fade-in");
        }, 500);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handlePrev = () => {
    setAnimation("fade-out");
    setTimeout(() => {
      setCurrentQuestion(currentQuestion - 1);
      setAnimation("fade-in");
    }, 500);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = { ...answers, ...values };
        axios
          .post("/api/submit", payload)
          .then(() => {
            setSubmitted(true);
            message.success("Submitted successfully");
          })
          .catch((error) => {
            console.error(error);
            message.error("Submission failed");
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

  if (submitted) {
    return <div>Thank you for completing the questionnaire!</div>;
  }

  return (
    <Card
      title={`Question ${currentQuestion + 1}/${questions.length}`}
      style={{
        width: 500,
        margin: "auto",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
      styles={{
        header: {
          backgroundColor: "#1890ff",
          color: "#fff",
          fontFamily: "Roboto, sans-serif",
        },
      }}
      // headStyle={{
      //   backgroundColor: "#1890ff",
      //   color: "#fff",
      //   fontFamily: "Roboto, sans-serif",
      // }}
    >
      <Form form={form} layout="vertical" initialValues={answers}>
        <div className={animation}>
          <Form.Item
            name={`question_${questions[currentQuestion].id}`}
            label={
              <Title
                level={5}
                style={{ fontFamily: "Roboto, sans-serif", fontSize: "18px" }}
              >
                {questions[currentQuestion].text}
              </Title>
            }
            rules={[{ required: true, message: "Please select an option!" }]}
          >
            <Radio.Group>
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  <Radio value={option}>{option}</Radio>
                </div>
              ))}
            </Radio.Group>
          </Form.Item>
        </div>
        <Form.Item>
          <Button
            type="default"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            style={{ marginRight: "8px" }}
          >
            Previous
          </Button>
          {currentQuestion < questions.length - 1 ? (
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Form.Item>
        <Progress percent={progressPercent} showInfo={false} />
      </Form>
    </Card>
  );
};

export default Questionnaire;
