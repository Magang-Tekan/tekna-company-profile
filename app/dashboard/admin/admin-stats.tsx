"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconUsers, IconShield, IconEdit, IconActivity } from "@tabler/icons-react";
import { AdminUser } from "@/lib/services/admin-auth.service";

interface AdminStatsProps {
  adminUsers: AdminUser[];
}

export function AdminStats({ adminUsers }: AdminStatsProps) {
  const stats = {
    totalUsers: adminUsers.length,
    superAdmins: adminUsers.filter(user => user.role === 'super_admin').length,
    admins: adminUsers.filter(user => user.role === 'admin').length,
    editors: adminUsers.filter(user => user.role === 'editor').length,
    activeUsers: adminUsers.filter(user => user.is_active).length,
    inactiveUsers: adminUsers.filter(user => !user.is_active).length
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "All admin users",
      icon: IconUsers,
      variant: "default" as const
    },
    {
      title: "Super Admins",
      value: stats.superAdmins,
      description: "Full system access",
      icon: IconShield,
      variant: "destructive" as const
    },
    {
      title: "Admins",
      value: stats.admins,
      description: "Content & settings",
      icon: IconShield,
      variant: "default" as const
    },
    {
      title: "Editors",
      value: stats.editors,
      description: "Content only",
      icon: IconEdit,
      variant: "secondary" as const
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      description: "Currently active",
      icon: IconActivity,
      variant: "default" as const
    },
    {
      title: "Inactive Users",
      value: stats.inactiveUsers,
      description: "Deactivated",
      icon: IconActivity,
      variant: "outline" as const
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title} className={stat.variant === 'outline' ? 'border-dashed' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${
                stat.variant === 'destructive' ? 'text-destructive' :
                stat.variant === 'secondary' ? 'text-secondary-foreground' :
                stat.variant === 'outline' ? 'text-muted-foreground' :
                'text-primary'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
