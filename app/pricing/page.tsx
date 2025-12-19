import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "Hoàn hảo để trải nghiệm dịch vụ",
    features: [
      "5,000 ký tự mỗi tháng",
      "3 giọng đọc cơ bản",
      "Chuyển đổi Speech-to-Text giới hạn",
      "Tốc độ xử lý tiêu chuẩn",
    ],
    buttonText: "Bắt đầu ngay",
    highlight: false,
  },
  {
    name: "Pro",
    price: "199,000",
    description: "Dành cho cá nhân và nhà sáng tạo nội dung",
    features: [
      "100,000 ký tự mỗi tháng",
      "Toàn bộ thư viện giọng đọc",
      "Ưu tiên tốc độ xử lý",
      "Hỗ trợ Voice Cloning",
      "Không giới hạn Speech-to-Text",
    ],
    buttonText: "Nâng cấp ngay",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Liên hệ",
    description: "Giải pháp tùy chỉnh cho doanh nghiệp",
    features: [
      "Ký tự không giới hạn",
      "API tích hợp riêng",
      "Hỗ trợ 24/7",
      "Tùy chỉnh giọng đọc riêng biệt",
      "Bảo mật nâng cao",
    ],
    buttonText: "Liên hệ chúng tôi",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Bảng giá dịch vụ <span className="text-blue-600">LipVoice</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Chọn gói cước phù hợp với nhu cầu sáng tạo của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 bg-white border rounded-2xl shadow-sm transition-all hover:shadow-md ${
                plan.highlight
                  ? "border-blue-600 ring-1 ring-blue-600"
                  : "border-gray-200"
              }`}
            >
              {plan.highlight && (
                <Badge className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-3 py-1">
                  Phổ biến nhất
                </Badge>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {plan.price !== "Liên hệ" ? `${plan.price}đ` : plan.price}
                  </span>
                  {plan.price !== "Liên hệ" && (
                    <span className="ml-1 text-sm font-semibold text-gray-500">
                      /tháng
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="mt-1 bg-blue-100 rounded-full p-0.5">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlight ? "default" : "outline"}
                className={`w-full py-6 text-base font-semibold ${
                  plan.highlight ? "bg-blue-600 hover:bg-blue-700" : ""
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
