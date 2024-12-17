import React from "react";

// Chakra imports
import { Button, Flex, Link, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

// Assets
import banner from "assets/img/nfts/NftBanner1.png";

export default function Banner() {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <Flex
      direction="column"
      bgImage={banner}
      bgSize="cover"
      py={{ base: "30px", md: "56px" }}
      px={{ base: "30px", md: "64px" }}
      borderRadius="30px"
    >
      <Text
        fontSize={{ base: "24px", md: "34px" }}
        color="white"
        mb="14px"
        maxW={{
          base: "100%",
          md: "64%",
          lg: "46%",
          xl: "70%",
          "2xl": "50%",
          "3xl": "42%",
        }}
        fontWeight="700"
        lineHeight={{ base: "32px", md: "42px" }}
      >
        Manage your user through this dashboard
      </Text>
      <Text
        fontSize="md"
        color="#E3DAFF"
        maxW={{
          base: "100%",
          md: "64%",
          lg: "40%",
          xl: "56%",
          "2xl": "46%",
          "3xl": "34%",
        }}
        fontWeight="500"
        mb="40px"
        lineHeight="28px"
      >
        Manage all your services in one place
      </Text>
      <Flex align="center">
      <Link onClick={() => navigate("/admin/gic")}>
          <Text className="bg-white pe-7 ps-7 pt-2 pb-2  rounded-3xl text-gray-700 font-semibold text-[15px]">
            Go to GIC
          </Text>
        </Link>
        {/* Link to the GIC page */}
        <Link onClick={() => navigate("/admin/forex")}>
          <Text className="ms-2 bg-white pe-5 ps-5 pt-2 pb-2  rounded-3xl text-gray-700 font-semibold text-[15px]">
            Go to FOREX
          </Text>
        </Link>
      </Flex>
    </Flex>
  );
}
