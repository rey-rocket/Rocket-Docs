import os
import json
from datetime import datetime
from typing import Dict, List, Optional

def define_env(env):
    """
    Define custom macros for Rocket Education Rewards documentation
    """
    
    @env.macro
    def rocket_badge(rank: str = "explorer", size: str = "medium") -> str:
        """
        Generate a rank badge with Rocket styling
        
        Args:
            rank: The rank level (explorer, pilot, commander)
            size: Badge size (small, medium, large)
        
        Returns:
            HTML string for the rank badge
        """
        rank_colors = {
            "explorer": "#10b981",  # Green
            "pilot": "#3b82f6",     # Blue
            "commander": "#8b5cf6"  # Purple
        }
        
        rank_icons = {
            "explorer": "⚡",
            "pilot": "⚡",
            "commander": "👑"
        }
        
        size_classes = {
            "small": "text-sm px-2 py-1",
            "medium": "text-base px-3 py-2",
            "large": "text-lg px-4 py-3"
        }
        
        color = rank_colors.get(rank.lower(), rank_colors["explorer"])
        icon = rank_icons.get(rank.lower(), rank_icons["explorer"])
        size_class = size_classes.get(size.lower(), size_classes["medium"])
        
        return f"""
        <span class="inline-flex items-center {size_class} rounded-full font-semibold text-white" 
              style="background: linear-gradient(135deg, {color} 0%, {color}bb 100%); box-shadow: 0 4px 12px {color}33;">
            <span class="mr-1">{icon}</span>
            {rank.title()} Rank
        </span>
        """
    
    @env.macro
    def progress_bar(percentage: int, label: str = "", color: str = "orange") -> str:
        """
        Generate a progress bar with Rocket styling
        
        Args:
            percentage: Progress percentage (0-100)
            label: Optional label for the progress bar
            color: Color theme (orange, blue, green, purple)
        
        Returns:
            HTML string for the progress bar
        """
        color_gradients = {
            "orange": "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
            "blue": "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
            "green": "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
            "purple": "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
        }
        
        gradient = color_gradients.get(color.lower(), color_gradients["orange"])
        percentage = max(0, min(100, percentage))  # Clamp between 0-100
        
        label_html = f'<div class="text-sm font-medium text-gray-700 mb-2">{label}</div>' if label else ""
        
        return f"""
        <div class="mb-4">
            {label_html}
            <div class="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                <div class="h-3 rounded-full transition-all duration-500 ease-out" 
                     style="width: {percentage}%; background: {gradient}; 
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);"></div>
            </div>
            <div class="text-right text-xs text-gray-600 mt-1">{percentage}% Complete</div>
        </div>
        """
    
    @env.macro
    def achievement_card(title: str, description: str, icon: str = "⚡", unlocked: bool = True) -> str:
        """
        Generate an achievement card
        
        Args:
            title: Achievement title
            description: Achievement description
            icon: Achievement icon (emoji or HTML)
            unlocked: Whether the achievement is unlocked
        
        Returns:
            HTML string for the achievement card
        """
        if unlocked:
            card_class = "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
            opacity = "opacity-100"
            shadow = "shadow-lg"
        else:
            card_class = "bg-gray-200 text-gray-500"
            opacity = "opacity-60"
            shadow = "shadow-sm"
        
        return f"""
        <div class="achievement-card {card_class} {opacity} {shadow} rounded-xl p-6 mb-4 transform transition-all duration-300 hover:scale-105">
            <div class="flex items-center mb-3">
                <span class="text-3xl mr-3">{icon}</span>
                <h3 class="text-xl font-bold">{title}</h3>
            </div>
            <p class="text-sm">{description}</p>
            {'' if unlocked else '<div class="text-xs mt-2 opacity-70">⚡ Locked</div>'}
        </div>
        """
    
    @env.macro
    def points_counter(points: int, label: str = "Points", animated: bool = True) -> str:
        """
        Generate a points counter display
        
        Args:
            points: Number of points to display
            label: Label for the points
            animated: Whether to add animation effects
        
        Returns:
            HTML string for the points counter
        """
        animation_class = "animate-pulse" if animated else ""
        
        return f"""
        <div class="points-counter inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg {animation_class}">
            <span class="text-xl mr-2">⚡</span>
            <span class="font-bold text-lg">{points:,}</span>
            <span class="text-sm ml-1">{label}</span>
        </div>
        """
    
    @env.macro
    def rocket_launch_button(launches_available: int = 1, disabled: bool = False) -> str:
        """
        Generate a rocket launch button
        
        Args:
            launches_available: Number of launches available
            disabled: Whether the button is disabled
        
        Returns:
            HTML string for the rocket launch button
        """
        if disabled or launches_available <= 0:
            button_class = "bg-gray-400 cursor-not-allowed"
            text_class = "text-gray-600"
            hover_effect = ""
        else:
            button_class = "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 cursor-pointer"
            text_class = "text-white"
            hover_effect = "transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
        
        status_text = f"{launches_available} Available" if launches_available > 0 else "No Launches Available"
        
        return f"""
        <div class="rocket-launch-button {button_class} {text_class} {hover_effect} rounded-xl p-6 text-center shadow-lg mb-4">
            <div class="text-4xl mb-2">⚡</div>
            <div class="font-bold text-lg">Rocket Launch</div>
            <div class="text-sm opacity-90">{status_text}</div>
        </div>
        """
    
    @env.macro
    def feature_grid(features: List[Dict[str, str]]) -> str:
        """
        Generate a feature grid with Rocket styling
        
        Args:
            features: List of feature dictionaries with 'title', 'description', and 'icon' keys
        
        Returns:
            HTML string for the feature grid
        """
        if not features:
            return ""
        
        feature_cards = []
        for feature in features:
            title = feature.get('title', 'Feature')
            description = feature.get('description', 'Feature description')
            icon = feature.get('icon', '⚡')
            
            card_html = f"""
            <div class="feature-card bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="flex items-center mb-4">
                    <span class="text-3xl mr-3">{icon}</span>
                    <h3 class="text-xl font-semibold text-gray-800">{title}</h3>
                </div>
                <p class="text-gray-600">{description}</p>
            </div>
            """
            feature_cards.append(card_html)
        
        return f"""
        <div class="feature-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {''.join(feature_cards)}
        </div>
        """
    
    @env.macro
    def integration_status(name: str, status: str = "active", version: str = "") -> str:
        """
        Generate an integration status badge
        
        Args:
            name: Integration name
            status: Status (active, beta, planned, deprecated)
            version: Version string (optional)
        
        Returns:
            HTML string for the integration status
        """
        status_configs = {
            "active": {"color": "#10b981", "icon": "✅", "text": "Active"},
            "beta": {"color": "#f59e0b", "icon": "🧪", "text": "Beta"},
            "planned": {"color": "#6b7280", "icon": "⚡", "text": "Planned"},
            "deprecated": {"color": "#ef4444", "icon": "⚡", "text": "Deprecated"}
        }
        
        config = status_configs.get(status.lower(), status_configs["active"])
        version_text = f" v{version}" if version else ""
        
        return f"""
        <div class="integration-status inline-flex items-center bg-white rounded-lg px-4 py-2 shadow-md border-l-4 mb-4" 
             style="border-color: {config['color']};">
            <span class="mr-2">{config['icon']}</span>
            <span class="font-semibold text-gray-800">{name}</span>
            <span class="ml-2 px-2 py-1 rounded-full text-xs font-medium text-white" 
                  style="background-color: {config['color']};">
                {config['text']}{version_text}
            </span>
        </div>
        """
    
    @env.macro
    def api_endpoint(method: str, endpoint: str, description: str = "") -> str:
        """
        Generate an API endpoint documentation block
        
        Args:
            method: HTTP method (GET, POST, PUT, DELETE, etc.)
            endpoint: API endpoint path
            description: Endpoint description
        
        Returns:
            HTML string for the API endpoint block
        """
        method_colors = {
            "GET": "#10b981",      # Green
            "POST": "#3b82f6",     # Blue
            "PUT": "#f59e0b",      # Orange
            "DELETE": "#ef4444",   # Red
            "PATCH": "#8b5cf6"     # Purple
        }
        
        color = method_colors.get(method.upper(), "#6b7280")
        
        description_html = f'<p class="text-sm text-gray-600 mt-2">{description}</p>' if description else ""
        
        return f"""
        <div class="api-endpoint bg-gray-50 rounded-lg p-4 mb-4 border-l-4" style="border-color: {color};">
            <div class="flex items-center mb-2">
                <span class="px-2 py-1 rounded text-xs font-bold text-white mr-3" 
                      style="background-color: {color};">
                    {method.upper()}
                </span>
                <code class="text-sm bg-gray-200 px-2 py-1 rounded font-mono">{endpoint}</code>
            </div>
            {description_html}
        </div>
        """
    
    @env.macro
    def requirement_check(requirements: List[str], title: str = "Requirements") -> str:
        """
        Generate a requirements checklist
        
        Args:
            requirements: List of requirement strings
            title: Title for the requirements section
        
        Returns:
            HTML string for the requirements checklist
        """
        if not requirements:
            return ""
        
        requirement_items = []
        for req in requirements:
            requirement_items.append(f'<li class="flex items-center mb-2"><span class="text-orange-500 mr-2">🔸</span>{req}</li>')
        
        return f"""
        <div class="requirement-check bg-blue-50 rounded-lg p-6 mb-6 border-l-4 border-blue-500">
            <h4 class="font-semibold text-blue-800 mb-4 flex items-center">
                <span class="mr-2">⚡</span>{title}
            </h4>
            <ul class="text-blue-700">
                {''.join(requirement_items)}
            </ul>
        </div>
        """
    
    @env.macro
    def last_updated() -> str:
        """
        Generate a last updated timestamp
        
        Returns:
            HTML string with formatted timestamp
        """
        now = datetime.now()
        formatted_date = now.strftime("%B %d, %Y at %I:%M %p")
        
        return f"""
        <div class="last-updated text-xs text-gray-500 mt-8 pt-4 border-t border-gray-200">
            <span class="mr-1">📅</span>Last updated: {formatted_date}
        </div>
        """
    
    @env.macro
    def rocket_callout(content: str, type: str = "info", title: str = "") -> str:
        """
        Generate a Rocket-themed callout box
        
        Args:
            content: Callout content
            type: Callout type (info, success, warning, error, rocket)
            title: Optional title
        
        Returns:
            HTML string for the callout
        """
        callout_configs = {
            "info": {"color": "#3b82f6", "icon": "⚡", "bg": "bg-blue-50"},
            "success": {"color": "#10b981", "icon": "✅", "bg": "bg-green-50"},
            "warning": {"color": "#f59e0b", "icon": "⚡", "bg": "bg-yellow-50"},
            "error": {"color": "#ef4444", "icon": "❌", "bg": "bg-red-50"},
            "rocket": {"color": "#f97316", "icon": "⚡", "bg": "bg-orange-50"}
        }
        
        config = callout_configs.get(type.lower(), callout_configs["info"])
        title_html = f'<h5 class="font-semibold mb-2 flex items-center"><span class="mr-2">{config["icon"]}</span>{title}</h5>' if title else ""
        
        return f"""
        <div class="rocket-callout {config['bg']} rounded-lg p-4 mb-4 border-l-4" style="border-color: {config['color']};">
            {title_html}
            <div class="text-gray-700">{content}</div>
        </div>
        """