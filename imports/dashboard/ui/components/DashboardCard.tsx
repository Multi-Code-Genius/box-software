import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUp, ArrowDown, Zap } from "lucide-react";

const DashboardCard = () => {
  const cardsData = [
    {
      icon: <Zap />,
      title: "Total booked slot in this month",
      value: 250,
      changePercent: 30,
      changeDirection: "up",
    },
    {
      icon: <Zap />,
      title: "Total Revenue in this month",
      value: 20,
      changePercent: 5,
      changeDirection: "down",
    },
    {
      icon: <Zap />,
      title: "Total players in this month",
      value: 150,
      changePercent: 15,
      changeDirection: "up",
    },
  ];

  return (
    <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {cardsData.map((card, index) => {
        const ArrowIcon = card.changeDirection === "up" ? ArrowUp : ArrowDown;

        return (
          <Card key={index} className="gap-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-5">
                <div className="h-10 w-10 bg-slate-300 rounded-full flex justify-center items-center">
                  {card.icon}
                </div>
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h1 className="text-3xl font-bold">{card.value}</h1>
            </CardContent>
            <CardFooter className="font-medium">
              <div className="flex items-center gap-1 ">
                <p
                  className={`flex items-center gap-1 ${
                    card.changeDirection === "up"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  <ArrowIcon size={18} />
                  {card.changePercent}%
                </p>
                <span>vs last month</span>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardCard;
